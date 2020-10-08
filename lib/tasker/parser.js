'use strict';
const log = require('../logger');
const Gherkin = require('gherkin');
const fs = require('fs');

function parser(feature) {

    const _this = {};
    const parser = new Gherkin.Parser(new Gherkin.AstBuilder());
    parser.stopAtFirstError = false;
    const matcher = new Gherkin.TokenMatcher();
    const scanner = new Gherkin.TokenScanner(fs.readFileSync(feature, 'UTF-8'));

    try {
        _this.feature = parser.parse(scanner, matcher);
        _this.isSucceeded = true;
    } catch (e) {
        log.error('error in parsing feature ', feature);
        _this.isSucceeded = false;
    }

    return _this;
}

module.exports = parser;