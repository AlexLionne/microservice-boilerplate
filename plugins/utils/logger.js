const winston = require('winston');

// Imports the Google Cloud client library for Winston
const {LoggingWinston} = require('@google-cloud/logging-winston');

const loggingWinston = new LoggingWinston();


const logger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console(),
        loggingWinston,
    ],
});



module.exports = {
    info: logger.info,
    error: logger.error,
    debug: logger.debug,
    verbose: logger.verbose,
}
