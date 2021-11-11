function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
}

const {Command} = require('commander');
const path = require('path');
const _ = _interopRequireDefault(require('lodash'));


module.exports = function program() {

    const program = new Command(path.basename(process.argv[1]));

    program
        .storeOptionsAsProperties(false)
        .passCommandToAction(false);

    function mergeJson(option) {
        return function (str, memo) {
            let val = void 0;
            try {
                val = JSON.parse(str);
            } catch (error) {
                throw new Error(option + ' passed invalid JSON: ' + error.message + ': ' + str);
            }
            if (!_.default.isPlainObject(val)) {
                throw new Error(option + ' must be passed JSON of an object: ' + str);
            }
            return _.default.merge(memo, val);
        };
    }

    function collect(val, memo) {
        memo.push(val);
        return memo;
    }

    function validateLanguage(val) {
        if (!_lodash.default.includes(_lodash.default.keys(_gherkin.default.DIALECTS), val)) {
            throw new Error(`Unsupported ISO 639-1: ${val}`);
        }
        return val;
    }

    function mergeTags(val, memo) {
        return memo === '' ? `(${val})` : `${memo} and (${val})`;
    }

    function validateCountOption(val, optionName) {
        val = parseInt(val);

        if (isNaN(val) || val < 0) {
            throw new Error(`${optionName} must be a non negative integer`);
        }

        return val;
    }

    const ArgvParser = {
        mergeJson: mergeJson,
        collect: collect,
        validateLanguage: validateLanguage,
        mergeTags: mergeTags,
        validateCountOption: validateCountOption
    };

    program.storeOptionsAsProperties(false)
        .usage('[options] [<GLOB|DIR|FILE[:LINE]>...]')
        .option('-b, --backtrace', 'show full backtrace for errors')
        .option('-d, --dry-run', 'invoke formatters without executing steps', false)
        .option('--exit', 'force shutdown of the event loop when the test run has finished: cucumber will call process.exit', false)
        .option('--fail-fast', 'abort the run on first failure', false)
        .option('-f, --format <TYPE[:PATH]>', 'specify the output format, optionally supply PATH to redirect formatter output (repeatable)', ArgvParser.collect, [])
        .option('--format-options <JSON>', 'provide options for formatters (repeatable)', ArgvParser.mergeJson('--format-options'), {})
        .option('--i18n-keywords <ISO 639-1>', 'list language keywords', ArgvParser.validateLanguage, '')
        .option('--i18n-languages', 'list languages', false)
        .option('--language <ISO 639-1>', 'provide the default language for feature files', 'en')
        .option('--name <REGEXP>', 'only execute the scenarios with name matching the expression (repeatable)', ArgvParser.collect, [])
        .option('--no-strict', 'succeed even if there are pending steps')
        .option('--order <TYPE[:SEED]>', 'run scenarios in the specified order. Type should be `defined` or `random`', 'defined')
        .option('-p, --profile <NAME>', 'specify the profile to use (repeatable)', ArgvParser.collect, [])
        .option('--parallel <NUMBER_OF_WORKERS>', 'run in parallel with the given number of workers', (val) => ArgvParser.validateCountOption(val, '--parallel'), 0)
        .option('--predictable-ids', 'Use predictable ids in messages (option ignored if using parallel)', false)
        .option('--publish', 'Publish a report to https://reports.cucumber.io', false)
        .option('--publish-quiet', 'Don\'t print information banner about publishing reports', false)
        .option('-r, --require <GLOB|DIR|FILE>', 'require files before executing features (repeatable)', ArgvParser.collect, [])
        .option('--require-module <NODE_MODULE>', 'require node modules before requiring files (repeatable)', ArgvParser.collect, [])
        .option('--retry <NUMBER_OF_RETRIES>', 'specify the number of times to retry failing test cases (default: 0)', (val) => ArgvParser.validateCountOption(val, '--retry'), 0)
        .option('--retryTagFilter, --retry-tag-filter <EXPRESSION>', `only retries the features or scenarios with tags matching the expression (repeatable).
        This option requires '--retry' to be specified.`, ArgvParser.mergeTags, '')
        .option('-t, --tags <EXPRESSION>', 'only execute the features or scenarios with tags matching the expression (repeatable)', ArgvParser.mergeTags, '')
        .option('--world-parameters <JSON>', 'provide parameters that will be passed to the world constructor (repeatable)', ArgvParser.mergeJson('--world-parameters'), {})
        .option('--parallel-type <NAME>', 'run parallel scenarios or features', collect, [])
        .option('-w, --workers <NUMBER_OF_SLAVES>', 'number of parallel slaves', val => ArgvParser.validateCountOption(val, '--workers'), 0);

    program.on('--help', () => {
        /* eslint-disable no-console */
        console.log('  For more details please visit https://github.com/cucumber/cucumber-js/blob/master/docs/cli.md\n');
        /* eslint-enable no-console */
    });

    program.parse(process.argv);

    const options = program.opts();

    return {
        options: options,
        args: program.args
    };
};
