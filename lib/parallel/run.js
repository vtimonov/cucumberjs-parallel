'use strict';
const log = require('../logger');
const program = require('../program');
const workersPool = require('./worker_pool');
const Tasks = require('./../tasker/tasks')();
const Report = require('../report/reporter')();

function exit(code, e) {
    if (e) {
        log.error(`Application has finished with errors: ${e}`);
    }
    process.exit(code);
}

module.exports = function () {

    let _argv;
    let _program;
    let maxWorkers;

    function run() {
        log.debug(_argv);
        maxWorkers = _program.options.workers;
        log.debug(`Max workers: ${maxWorkers}`);
        const tasks = getTasks();
        log.debug(`Total tasks: ${tasks}`);
        workersPool(maxWorkers, tasks.tasks).start().then(res => {
            if (res.length > 0) {
                Report.proceedResults({
                    parallelType: tasks.parallelType,
                    format: _program.options.format,
                    results: res,
                }).then(() => {
                    exit(0);
                });
            } else {
                exit(0);
            }
        }).catch(e => {
            exit(1, e);
        });
    }

    function getTasks() {
        const tasks = Tasks.getTasks(_program.args, _program.options);
        const parallelType = Tasks.getParallelType();
        return {tasks: tasks, parallelType: parallelType};
    }

    function invoke(argv) {
        _argv = argv;
        _program = program();
        run();
    }

    return {
        invoke: invoke
    }
}