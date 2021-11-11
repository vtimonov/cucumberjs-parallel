const variablesForRemoval = ['--parallel-type', '-w', '--workers'];

function cleanUpArgs(args) {
    for (let v of variablesForRemoval) {
        const index = args.indexOf(v);
        if (index > -1) {
            args.splice(index, 2);
        }
    }
    return args;
}

module.exports = function formatArgs(data) {
    const args = data._args;

    function updateFeaturePath() {
        args[2] = data.task;
    }

    // https://github.com/cucumber/cucumber-js/issues/786#issuecomment-318334193
    function addBackTrace() {
        args.push('--backtrace');
    }

    updateFeaturePath();
    addBackTrace();

    return cleanUpArgs(args);
};
