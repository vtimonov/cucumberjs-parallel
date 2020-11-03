'use strict';
const logger = require('../logger')(__filename);
const Parser = require('./parser');
const Finder = require('fs-finder');
const ParallelTypes = require('./parallelTypes');

module.exports = function tasks() {

    const scenarios = [];
    let parallelType = ParallelTypes.FEATURES;

    function processScenarios(options) {
        function scenarioAsString(scenario) {
            return options.featureFilePath + ':' + scenario.location.line;
        }

        options.feature.children.forEach(function (scenario) {
            switch (scenario.type) {
                case 'ScenarioOutline':{
                    scenario.examples.forEach(function (example) {
                        example.tableBody.forEach(function (tableRow) {
                            scenarios.push(scenarioAsString(tableRow));
                        });
                    });
                    break;
                }
                case 'Scenario':{
                    scenarios.push(scenarioAsString(scenario));
                    break;
                }
            }
        });
    }

    function getParallelType() {
        return parallelType;
    }

    function getFeatures(fromDirectory, parallelRunType) {
        if (parallelRunType) {
            logger.debug('run parallel ' + parallelRunType);
            parallelType = parallelRunType;
        }

        const features = Finder.from(fromDirectory).findFiles('*.feature');
        logger.debug('features found ', features);
        return features;
    }

    function getScenarios(fromDirectory, parallelRunType) {
        if (parallelRunType) {
            logger.debug('run parallel ' + parallelRunType);
            parallelType = parallelRunType;
        }

        getFeatures(fromDirectory).forEach(function (featureFilePath) {
            const parser = Parser(featureFilePath);
            if (parser.isSucceeded) {
                processScenarios({
                    featureFilePath: featureFilePath,
                    feature: parser.feature
                });
            }
        });

        return scenarios;
    }

    function isRerunFeaturesPassed(cucumberProgram) {
        const rerun = cucumberProgram.rerun;
        return rerun && rerun instanceof Array && rerun.length > 0;
    }

    function getParallelTypeOpts(type) {
        if (type === undefined) {
            return ParallelTypes.FEATURES;
        }
        return type;
    }

    function getTasks(featuresOrDirectoryPath, cucumberProgram) {
        parallelType = getParallelTypeOpts(cucumberProgram.parallelType[0]);

        if (isRerunFeaturesPassed(cucumberProgram)) {
            return featuresOrDirectoryPath;
        }

        const fromDirectory = featuresOrDirectoryPath[0];

        return parallelType && typeof parallelType === 'string' && parallelType.toLowerCase() === ParallelTypes.SCENARIOS
            ? getScenarios(fromDirectory, ParallelTypes.SCENARIOS)
            : getFeatures(fromDirectory, ParallelTypes.FEATURES);
    }

    return {
        getTasks: getTasks,
        getParallelType: getParallelType
    };
};
