const winston = require('winston');

process.env.envTMB = (process.env.environment || "local");
 

const options = {
  file: {
    level: "info",
    filename: 'logs/app.log',
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  },
  error: {
    level: "error",
    filename: 'logs/error.log',
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(info => `[${info.timestamp}] [${info.label}] ${info.level}: ${info.message}`)
    ),
  },
  console: {
    level: "debug",
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(info => `[${info.timestamp}] [${info.label}] ${info.level}: ${JSON.stringify(info.message)}`)
    ),
  }
};
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(info => `[${info.timestamp}] [${info.label}] ${info.level}: ${JSON.stringify(info.message)}`)
  ),
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.File(options.error),
    new winston.transports.Console(options.console)
  ],
});
module.exports = logger;
