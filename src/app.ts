

import express from 'express';
import { Request, Response} from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Customer  from './models/customer';
import cors from 'cors';
mongoose.set('strictQuery', false);
const app = express();

//adding middleware to parse data
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const PORT = process.env.PORT || 3000;
const CONNECTION = process.env.CONNECTION;
                                                                                                                                  



app.get('/', (req:Request, res:Response) => {
    res.send('Welcome !!');
});
app.get('/api/customers', async (req:Request, res:Response) => {
    console.log(await mongoose.connection.db.listCollections().toArray());
    try {
        const result = await Customer.find();
        res.json({ customers: result });
    } catch (e) {
        res.status(500).json({ error: 'error' });
    }
});

app.get('/api/customers/:id', async (req:Request, res:Response) => {
    console.log({ requestParams: req.params, requestQuery: req.query });
    try {
        const { id: customerId } = req.params;
        console.log(customerId);
        const customer = await Customer.findById(customerId);
        console.log(customer);
        if (!customer) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json({ customer });
        }
    } catch (e) {
        res.status(500).json({ error: 'something went wrong' });
    }
});

app.get('/api/orders/:id', async (req:Request, res:Response) => {
    try {
        const result = await Customer.findOne({ 'orders._id': req.params.id });
        if (result) {
            res.json(result);
        } else {
            res.status(404).json({ error: 'Order was not found' });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Something went wrong!' });
    }
});

app.delete('/api/customers/:id', async (req:Request, res:Response) => {
    try {
        const customerId = req.params.id;
        const result = await Customer.deleteOne({ _id: customerId });
        res.json({ deletedCount: result.deletedCount });
    } catch (e) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.put('/api/customers/:id', async (req:Request, res:Response) => {
    try {
        const customerId = req.params.id;
        const customer = await Customer.findOneAndReplace(
            { _id: customerId },
            req.body,
            { new: true }
        );
        console.log(customer);
        res.json({ customer });
    } catch (e) {
        console.log((e as Error ).message);
        res.status(500).json({ error: 'Something is wrong!' });
    }
});

app.patch('/api/customers/:id', async (req:Request, res:Response) => {
    try {
        console.log(req.params);
        const customerId = req.params.id;

        const customer = await Customer.findOneAndUpdate(
            { _id: customerId },
            req.body,
            { new: true }
        );
        console.log(customer);
        res.json({ customer });
    } catch (e) {
        console.log((e as Error).message);
        res.status(500).json({ error: 'Something is wrong!' });
    }
});
app.patch('/api/orders/:id', async (req:Request, res:Response) => {
    console.log(req.params.id);
    const orderId = req.params.id;
    req.body._id = orderId;
    try {
       const result = await Customer.findOneAndUpdate(
            { 'orders._id': orderId },
            { $set: { 'orders.$': req.body } },
            { new: true }
        );
        console.log(result);
        if (result) {
            res.json(result);
        } else {
            res.status(404).json({ error: 'Something went wrong' });
        }
    } catch (e) {
        console.log((e as Error ).message);
        res.status(500).json({ error: 'Something went wrong!!' });
    }
});

app.post('/', (req:Request, res:Response) => {
    res.send('This is a post request');
});
app.post('/api/customers', async (req:Request, res:Response) => {
    console.log(req.body);
    const customer = new Customer(req.body);
    try {
        await customer.save();
        res.status(201).json({ customer });
    } catch (e) {
        res.status(400).json({ error:((e as Error).message) });
    }
});

const start = async () => {
    try {
        await mongoose.connect(CONNECTION ?? 'mongodb://localhost');

        app.listen(PORT, () => {
            console.log('App is listening on port ' + PORT);
        });
    } catch (e) {
       console.log((e as Error ).message);
    }
};

start();
