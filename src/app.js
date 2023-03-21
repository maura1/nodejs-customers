"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const customer_1 = __importDefault(require("./models/customer"));
const cors_1 = __importDefault(require("cors"));
mongoose_1.default.set('strictQuery', false);
const app = (0, express_1.default)();
//adding middleware to parse data
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'production') {
    dotenv_1.default.config();
}
const PORT = process.env.PORT || 3000;
const CONNECTION = process.env.CONNECTION;
app.get('/', (req, res) => {
    res.send('Welcome !!');
});
app.get('/api/customers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(yield mongoose_1.default.connection.db.listCollections().toArray());
    try {
        const result = yield customer_1.default.find();
        res.json({ customers: result });
    }
    catch (e) {
        res.status(500).json({ error: 'error' });
    }
}));
app.get('/api/customers/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({ requestParams: req.params, requestQuery: req.query });
    try {
        const { id: customerId } = req.params;
        console.log(customerId);
        const customer = yield customer_1.default.findById(customerId);
        console.log(customer);
        if (!customer) {
            res.status(404).json({ error: 'User not found' });
        }
        else {
            res.json({ customer });
        }
    }
    catch (e) {
        res.status(500).json({ error: 'something went wrong' });
    }
}));
app.get('/api/orders/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield customer_1.default.findOne({ 'orders._id': req.params.id });
        if (result) {
            res.json(result);
        }
        else {
            res.status(404).json({ error: 'Order was not found' });
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Something went wrong!' });
    }
}));
app.delete('/api/customers/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customerId = req.params.id;
        const result = yield customer_1.default.deleteOne({ _id: customerId });
        res.json({ deletedCount: result.deletedCount });
    }
    catch (e) {
        res.status(500).json({ error: 'Something went wrong' });
    }
}));
app.put('/api/customers/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customerId = req.params.id;
        const customer = yield customer_1.default.findOneAndReplace({ _id: customerId }, req.body, { new: true });
        console.log(customer);
        res.json({ customer });
    }
    catch (e) {
        console.log(e.message);
        res.status(500).json({ error: 'Something is wrong!' });
    }
}));
app.patch('/api/customers/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.params);
        const customerId = req.params.id;
        const customer = yield customer_1.default.findOneAndUpdate({ _id: customerId }, req.body, { new: true });
        console.log(customer);
        res.json({ customer });
    }
    catch (e) {
        console.log(e.message);
        res.status(500).json({ error: 'Something is wrong!' });
    }
}));
app.patch('/api/orders/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params.id);
    const orderId = req.params.id;
    req.body._id = orderId;
    try {
        const result = yield customer_1.default.findOneAndUpdate({ 'orders._id': orderId }, { $set: { 'orders.$': req.body } }, { new: true });
        console.log(result);
        if (result) {
            res.json(result);
        }
        else {
            res.status(404).json({ error: 'Something went wrong' });
        }
    }
    catch (e) {
        console.log(e.message);
        res.status(500).json({ error: 'Something went wrong!!' });
    }
}));
app.post('/', (req, res) => {
    res.send('This is a post request');
});
app.post('/api/customers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const customer = new customer_1.default(req.body);
    try {
        yield customer.save();
        res.status(201).json({ customer });
    }
    catch (e) {
        res.status(400).json({ error: (e.message) });
    }
}));
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(CONNECTION !== null && CONNECTION !== void 0 ? CONNECTION : 'mongodb://localhost');
        app.listen(PORT, () => {
            console.log('App is listening on port ' + PORT);
        });
    }
    catch (e) {
        console.log(e.message);
    }
});
start();
