'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true,
});

const logger = require('../logger')(__filename);
const Cli = require('@cucumber/cucumber').Cli;
const _runtime = _interopRequireDefault(require('@cucumber/cucumber').Runtime);
const _pickle_filter = _interopRequireDefault(require('@cucumber/cucumber').PickleFilter);
const _helpers1 = require('@cucumber/cucumber/lib/formatter/helpers');
const _helpers2 = require('@cucumber/cucumber/lib/cli/helpers');
const I18n = _interopRequireWildcard(require('@cucumber/cucumber/lib/cli/i18n'));
const _support_code_library_builder = _interopRequireDefault(
    require('@cucumber/cucumber/lib/support_code_library_builder')
);
const path = require('path');
const {v4: uuidv4} = require('uuid');
const Result = require('../report/result');
const ResultTypes = require('../report/reportTypes');
const {Writable} = require('stream');
const gherkin_streams = require('@cucumber/gherkin-streams');
const events = require('events');

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

const cucumberCliStdout = new Writable({
    write(chunk) {
        logger.debug(chunk.toString());
    }
});


module.exports = async function cli(args) {
    const _args = args;
    const _stdout = cucumberCliStdout;
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
            this.stdout.write(I18n.getLanguages());
            return {shouldExitImmediately: true, success: true};
        }
        if (configuration.listI18nKeywordsFor !== '') {
            this.stdout.write(I18n.getKeywords(configuration.listI18nKeywordsFor));
            return {shouldExitImmediately: true, success: true};
        }
        const newId = () => uuidv4();
        const supportCodeConfig = {
            newId,
            supportCodePaths: configuration.supportCodePaths,
            supportCodeRequiredModules: configuration.supportCodeRequiredModules,
        };

        const supportCodeLibrary = getSupportCodeLibrary(supportCodeConfig);
        const eventBroadcaster = new events.EventEmitter();
        const eventDataCollector = new _helpers1.EventDataCollector(eventBroadcaster);

        const cleanup = await cli.initializeFormatters({
            eventBroadcaster,
            eventDataCollector,
            formatOptions: configuration.formatOptions,
            formats: configuration.formats,
            supportCodeLibrary,
        });

        await _helpers2.emitMetaMessage(eventBroadcaster);
        const gherkinMessageStream = gherkin_streams.GherkinStreams.fromPaths(configuration.featurePaths, {
            defaultDialect: configuration.featureDefaultLanguage,
            newId,
            relativeTo: _cwd,
        });
        let pickleIds = [];
        if (configuration.featurePaths.length > 0) {
            pickleIds = await _helpers2.parseGherkinMessageStream({
                cwd: _cwd,
                eventBroadcaster,
                eventDataCollector,
                gherkinMessageStream,
                order: configuration.order,
                pickleFilter: new _pickle_filter.default(configuration.pickleFilterOptions),
            });
        }
        _helpers2.emitSupportCodeMessages({
            eventBroadcaster,
            supportCodeLibrary,
            newId,
        });


        const runtime = new _runtime.default({
            eventBroadcaster,
            eventDataCollector,
            options: configuration.runtimeOptions,
            newId,
            pickleIds,
            supportCodeLibrary,
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
                                       newId,
                                       supportCodeRequiredModules: supportCodeRequiredModules,
                                       supportCodePaths: supportCodePaths,
                                   }) {

        // Refresh project modules on a new cli run
        for (const module of Object.keys(require.cache)) {
            if (module.startsWith(_cwd) && !module.includes('node_modules')) {
                delete require.cache[require.resolve(module)];
            }
        }

        supportCodeRequiredModules.map((module) => require(module));

        _support_code_library_builder.default.reset(_cwd, newId);

        supportCodePaths.forEach((codePath) => {
            try {
                require(codePath);
            } catch (e) {
                logger.error(e.stack);
                logger.error('codepath: ' + codePath);
            }
        });

        return _support_code_library_builder.default.finalize();
    }


    return {
        run: runCucumber,
    };
};
