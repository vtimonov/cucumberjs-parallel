module.exports = function formatArgs(data) {
    const args = data._args;

    function updateFeaturePath() {
        args[2] = data.task;
    }

    updateFeaturePath();

    return args;
}