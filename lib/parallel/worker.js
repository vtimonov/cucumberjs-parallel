const log = require('../logger');
const cli = require('../cucumber/cucumber.cli');
const formatArgs = require('../cucumber/args_formatter');

module.exports = async (id, data) => {
    const workerArgs = formatArgs(data);
    log.info(`Worker: ${id} picked task: ${data.task}`);
    return (await cli(workerArgs)).run();
}