const express = require('express');

const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const connectDB = require('./config/db');
const router = require('./routes/index');
const redis= require("./config/redis")



const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "https://movie-ticket-bookingfrontend.vercel.app",
  credentials: true
}));

app.get('/', (req, res) => res.send('Hello World!'));
app.use('/api', router);


connectDB();

const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

