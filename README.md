# Customer Management API

This project is a simple Customer Management API built using Express, Mongoose, and MongoDB. The API provides CRUD operations for managing customers and their orders.

## Prerequisites

Before you can run the project, you will need to have the following installed:

-   Node.js (v14 or later)
-   MongoDB

## Installation

1. Clone the repository.

    git clone https://github.com/your-username/customer-management-api.git

2. Navigate to the project folder and install the dependencies.

    cd customer-management-api
    npm install

3. Create a .env file in the project root directory with the following variables:

    PORT=<your_desired_port>
    CONNECTION=<your_mongodb_connection_string>

    Replace <your_desired_port> with the port number you want the server to run on and <your_mongodb_connection_string> with the connection string for your MongoDB instance.

## Running the Project

Start the server by running:

npm start

The server will start listening on the specified port, and you should see a message in the console indicating that the app is running.

## API Endpoints

The following endpoints are available:

-   GET /: Root endpoint, returns a welcome message.
-   GET /api/customers: Retrieve all customers.
-   GET /api/customers/:id: Retrieve a single customer by ID.
-   POST /api/customers: Create a new customer.
-   PUT /api/customers/:id: Update a customer by ID (replaces the entire document).
-   PATCH /api/customers/:id: Update a customer by ID (updates only the provided fields).
-   DELETE /api/customers/:id: Delete a customer by ID.
-   GET /api/orders/:id: Retrieve an order by ID.
-   PATCH /api/orders/:id: Update an order by ID.

## Contributing

If you want to contribute to the project, feel free to submit a pull request or open an issue.

## License

This project is licensed under the MIT License. See the LICENSE file for more information.
