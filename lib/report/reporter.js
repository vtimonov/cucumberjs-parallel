'use strict';

const logger = require('../logger')(__filename);
const ReportType = require('./reportTypes');
const ParallelType = require('../tasker/parallelTypes');
const fs = require('fs-extra');
const findIndex = require('lodash').findIndex;

function getParsedFormat(format) {
    const formatType = format.substring(0, format.indexOf(':'));
    const outputPath = format.substring(format.indexOf(':') + 1);
    return {type: formatType, output: outputPath}
}

module.exports = function report() {

    let parallelType;

    async function proceedResults(options) {
        parallelType = options.parallelType;

        for (const format of options.format) {
            const parsedFormat = getParsedFormat(format);
            if (parsedFormat.type === ReportType.JSON) {
                const jsonResults = [];
                options.results.forEach(value => {
                    if (value.type === ReportType.JSON) {
                        jsonResults.push(value.filePath);
                    }
                });
                await mergeJson(parsedFormat.output, jsonResults);
                break;
            }
        }
    }

    async function mergeJson(outputFile, files) {
        let cumulativeResult = [];

        for (const file of files) {
            const json = await readJson(file);
            if (json !== null) {
                if (parallelType === ParallelType.FEATURES) {
                    cumulativeResult = cumulativeResult.concat(json);
                } else if (parallelType === ParallelType.SCENARIOS) {
                    for (const res of json) {
                        const doesFeatureExist = findIndex(cumulativeResult, function (result) {
                            return result.uri === res.uri;
                        });
                        if (doesFeatureExist !== -1) {
                            cumulativeResult.forEach(value => {
                                if (value.uri === res.uri) {
                                    value.elements = value.elements.concat(res.elements);
                                }
                            });
                        } else {
                            cumulativeResult.push(res);
                        }
                    }
                }
            }
        }

        await writeJson(outputFile, cumulativeResult);
        await cleanup(files);
    }

    async function cleanup(files) {
        for (const file of files) {
            try {
                await fs.remove(file);
            } catch (err) {
                logger.error(err);
            }
        }
    }

    async function readJson(filePath) {
        try {
            return await fs.readJson(filePath);
        } catch (e) {
            logger.error(`Cannot parse file: ${filePath}, ${e}`);
            return null;
        }
    }

    async function writeJson(filePath, json) {
        try {
            await fs.outputFile(filePath, JSON.stringify(json, null, 2));
            return true;
        } catch (e) {
            logger.error(`Cannot write file: ${filePath}, ${e}`);
            return false;
        }
    }

    return {
        proceedResults: proceedResults
    };
};