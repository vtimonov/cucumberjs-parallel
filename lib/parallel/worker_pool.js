const workerpool = require('workerpool');
const path = require('path');
const log = require('../logger');

module.exports = function workersPool(workers, tasks) {

    let results = [];

    const tasksSize = tasks.length;

    const workersSize = workers !== 0 ? workers : tasksSize;

    // const taskPool = new TaskPool(workersSize, workersSize, 'thread');
    const taskPool = workerpool.pool(path.resolve(__dirname, './worker.js'), {
        minWorkers: workersSize | 'max',
        maxWorkers: workersSize,
        maxQueueSize: tasksSize,
        workerType: 'process'
    });

    const promises = [];

    async function start() {
        for (let i = 0; i < tasksSize; i++) {
            promises.push(taskPool.proxy()
                .then(function (worker) {
                    return worker.runTask(i,{
                        _args: process.argv,
                        task: tasks[i]
                    });
                })
                .then(function (result) {
                    if (!result.success) {
                        log.error(`Task ${tasks[i]} has been finished with an error.`);
                    } else {
                        results = results.concat(result.report);
                        log.info(`Task ${tasks[i]} has been finished successful`);
                    }
                })
                .catch(function (err) {
                    log.error(err);
                }));
        }

        await Promise.all(promises).then(() => {
            taskPool.terminate();
        }).catch(err => {
            console.log(err);
        });
        log.debug(`Pool has been cancelled.`);

        return results;
    }

    return {
        start: start
    }
}