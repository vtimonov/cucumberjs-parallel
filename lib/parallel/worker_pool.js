const TaskPool = require('@mcjxy/task-pool');
const path = require('path');
const log = require('../logger');

module.exports = function workersPool(workers, tasks) {

    let results = [];

    const taskSize = tasks.length;

    const workersSize = workers !== 0 ? workers : taskSize;

    const taskPool = new TaskPool(workersSize, taskSize, 'thread');

    async function start() {
        for (let i = 0; i < taskSize; i++) {
            taskPool.dispatch(path.resolve(__dirname, './worker.js'), {
                _args: process.argv,
                task: tasks[i]
            }).then(res => {
                if (!res.success) {
                    log.error(`Task ${tasks[i]} has been finished with an error.`);
                } else {
                    results = results.concat(res.report);
                    log.info(`Task ${tasks[i]} has been finished successful`);
                }
            }).catch(e => {
                log.error(e);
            });
        }
        log.debug(`Running tasks pool.`);
        await taskPool.wait();

        log.debug(`Cancelling pool.`);
        await taskPool.cancel();
        log.debug(`Pool has been cancelled.`);

        return results;
    }

    return {
        start: start
    }
}