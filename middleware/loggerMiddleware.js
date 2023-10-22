const logger = require('../config/winston-config');

const loggerMiddleware = (req, res, next) => {
  logger.info(`Handled ${req.method} request from ${req.originalUrl}`);
  next();
};

module.exports = loggerMiddleware;
