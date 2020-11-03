'use strict';
const logger = require('../logger')(__filename);
const Gherkin = require('gherkin');
const fs = require('fs');

function parser(feature) {

    const _this = {};
    const parser = new Gherkin.Parser(new Gherkin.AstBuilder());
    parser.stopAtFirstError = false;
    const matcher = new Gherkin.TokenMatcher();
    const scanner = new Gherkin.TokenScanner(fs.readFileSync(feature, 'UTF-8'));

    try {
        const gherkinDocument = parser.parse(scanner, matcher);
        if (gherkinDocument.feature){
            _this.feature = gherkinDocument.feature;
            _this.isSucceeded = true;
        }else {
            logger.warn(`The feature seems not to have content: ${feature}`);
            _this.isSucceeded = false;
        }
    } catch (e) {
        logger.error('error in parsing feature ', feature);
        _this.isSucceeded = false;
    }

    return _this;
}

module.exports = parser;