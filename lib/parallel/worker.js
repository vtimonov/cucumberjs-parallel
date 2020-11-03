const workerpool = require('workerpool');
const logger = require('../logger')(__filename);
const cli = require('../cucumber/cucumber.cli');
const formatArgs = require('../cucumber/args_formatter');

async function runTask(id, data) {
    const workerArgs = formatArgs(data);
    logger.info(`Task: ${id} has been started. Task arguments ${data.task}`);
    return (await cli(workerArgs)).run();
}

workerpool.worker({
    runTask: runTask
});
