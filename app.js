require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require('./config/db');
const handleError = require('./middleware/errorMiddleware');
const loggerMiddleware = require('./middleware/loggerMiddleware');

connectDB();

app.use(express.json());

app.use(loggerMiddleware);

app.use(handleError);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
