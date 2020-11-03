const { CucumberJSAllureFormatter } = require('allure-cucumberjs');
const { AllureRuntime } = require('allure-cucumberjs');
const dir = './allure-results/';

function Reporter(options) {
  return new CucumberJSAllureFormatter(
    options,
    new AllureRuntime({ resultsDir: dir }),
    {}
  );
}

Reporter.prototype = Object.create(CucumberJSAllureFormatter.prototype);
Reporter.prototype.constructor = Reporter;

exports.default = Reporter;
