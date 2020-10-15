const workerpool = require('workerpool');
const path = require('path');
const log = require('../logger');

module.exports = function workersPool(workers, tasks) {

    let results = [];

    const tasksSize = tasks.length;

    const workersSize = workers !== 0 ? workers : tasksSize;

    const taskPool = workerpool.pool(path.resolve(__dirname, './worker.js'), {
        minWorkers: workersSize | 'max',
        maxWorkers: workersSize,
        maxQueueSize: tasksSize,
        workerType: 'thread'
    });

    const promises = [];

    async function start() {
        for (let i = 0; i < tasksSize; i++) {
            const taskNumber = i + 1;
            promises.push(taskPool.proxy()
                .then(function (worker) {
                    return worker.runTask(taskNumber,{
                        _args: process.argv,
                        task: tasks[i]
                    });
                })
                .then(function (result) {
                    if (!result.success) {
                        log.error(`Task: ${taskNumber} has been finished with an error. Task arguments: ${tasks[i]}`);
                    } else {
                        results = results.concat(result.report);
                        log.info(`Task: ${taskNumber} has been finished successful. Task arguments: ${tasks[i]}`);
                    }
                })
                .catch(function (err) {
                    log.error(err);
                    process.exit(1);
                }));
        }

        await Promise.all(promises).then(async () => {
            await taskPool.terminate();
        }).catch(err => {
            log.error(err);
            process.exit(1);
        });
        log.debug(`Pool has been cancelled.`);

        return results;
    }

    return {
        start: start
    }
}