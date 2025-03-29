const http = require('http');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables before using them

const app = require('./app');
const connectToDb = require('./db/db');

const port = process.env.PORT || 3000;

// Call function to connect to database
connectToDb();

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
