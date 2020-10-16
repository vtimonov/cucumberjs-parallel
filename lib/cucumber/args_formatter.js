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

    return args;
}