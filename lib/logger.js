const log4js = require('log4js');
const path = require('path');


log4js.configure({
    appenders: {
        console: {type: 'console'}
    },
    categories: {
        default: {appenders: ['console'], level: 'info'}
    }
});

module.exports = function (loggerName) {
    let logName = path.basename(loggerName);
    if (logName.endsWith('.js')) {
        logName = logName.substring(0, logName.lastIndexOf('.'));
    }
    return log4js.getLogger(`[${logName}]`);
};