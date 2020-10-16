'use strict';
Object.defineProperty(exports, "__esModule", {
    value: true,
});

const Cli = require("cucumber").Cli;
const _runtime = _interopRequireDefault(require("cucumber").Runtime);
const _pickle_filter = _interopRequireDefault(require("cucumber").PickleFilter);
const _helpers2 = require("cucumber/lib/cli/helpers");
const I18n = _interopRequireWildcard(require("cucumber/lib/cli/i18n"));
const _events = _interopRequireDefault(require("events"));
const _support_code_library_builder = _interopRequireDefault(
    require("cucumber/lib/support_code_library_builder")
);
const _install_validator = require("cucumber/lib/cli/install_validator");
const path = require('path');
const {v4: uuidv4} = require('uuid');
const Result = require('../report/result');
const ResultTypes = require('../report/reportTypes');

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
}

function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        const newObj = {};
        if (obj != null) {
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    const desc =
                        Object.defineProperty && Object.getOwnPropertyDescriptor
                            ? Object.getOwnPropertyDescriptor(obj, key)
                            : {};
                    if (desc.get || desc.set) {
                        Object.defineProperty(newObj, key, desc);
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
        }
        newObj.default = obj;
        return newObj;
    }
}

function exitWithError(error) {
    console.error(error);
    process.exit(1);
}


module.exports = async function cli(args) {
    const _args = args;
    const _stdout = process.stdout;
    const _cwd = process.cwd();

    async function runCucumber() {
        const cli = new Cli({
            argv: _args,
            cwd: _cwd,
            stdout: _stdout,
        });

        let result;
        try {
            result = await run(cli);
        } catch (error) {
            exitWithError(error);
        }

        const exitCode = result.success ? 0 : 1;
        if (result.shouldExitImmediately) {
            process.exit(exitCode);
        } else {
            process.exitCode = exitCode;
        }

        return result;
    }

    async function run(cli) {
        await (0, _install_validator.validateInstall)(_cwd);
        const configuration = await cli.getConfiguration();

        let jsonOutputPath;
        const report = [];

        for (const conf of configuration.formats) {
            if (conf.type === ResultTypes.JSON) {
                const dir = path.dirname(conf.outputTo);
                jsonOutputPath = path.resolve(dir, `${uuidv4()}.json`);
                conf.outputTo = jsonOutputPath;
                report.push(new Result(ResultTypes.JSON, jsonOutputPath));
            }
        }

        if (configuration.listI18nLanguages) {
            _stdout.write(I18n.getLanguages());
            return {
                success: true,
            };
        }

        if (configuration.listI18nKeywordsFor) {
            _stdout.write(I18n.getKeywords(configuration.listI18nKeywordsFor));
            return {
                success: true,
            };
        }

        const supportCodeLibrary = getSupportCodeLibrary(configuration);
        const eventBroadcaster = new _events.default();
        const cleanup = await cli.initializeFormatters({
            eventBroadcaster: eventBroadcaster,
            formatOptions: configuration.formatOptions,
            formats: configuration.formats,
            supportCodeLibrary: supportCodeLibrary,
        });
        const testCases = await (0, _helpers2.getTestCasesFromFilesystem)({
            cwd: _cwd,
            eventBroadcaster: eventBroadcaster,
            featureDefaultLanguage: configuration.featureDefaultLanguage,
            featurePaths: configuration.featurePaths,
            order: configuration.order,
            pickleFilter: new _pickle_filter.default(
                configuration.pickleFilterOptions
            ),
        });

        const runtime = new _runtime.default({
            eventBroadcaster: eventBroadcaster,
            options: configuration.runtimeOptions,
            supportCodeLibrary: supportCodeLibrary,
            testCases: testCases,
        });

        const success = await runtime.start();

        await cleanup();

        return {
            shouldExitImmediately: configuration.shouldExitImmediately,
            success: success,
            report: report,
        };
    }

    function getSupportCodeLibrary({
                                       supportCodeRequiredModules: supportCodeRequiredModules,
                                       supportCodePaths: supportCodePaths,
                                   }) {

        // Refresh project modules on a new cli run
        for (const module of Object.keys(require.cache)){
            if (module.startsWith(_cwd) && !module.includes('node_modules')){
                delete require.cache[require.resolve(module)];
            }
        }

        supportCodeRequiredModules.map((module) => require(module));

        _support_code_library_builder.default.reset(_cwd);

        supportCodePaths.forEach(codePath => require(codePath));

        return _support_code_library_builder.default.finalize();
    }


    return {
        run: runCucumber,
    };
};
