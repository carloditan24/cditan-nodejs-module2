const mongoose = require('mongoose');
const logger = require('../config/winston-config');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
