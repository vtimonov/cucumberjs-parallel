CucumberJS Parallel
=================
***Run Cucumber Features or Scenarios in Parallel with limited threads count***

[![Build Status][travis-shield]][travis-link] [![npm][npm-shield]][npm-link] [![License][license-shield]][license-link]

## Install
Cucumber 6
``` bash
npm install cucumberjs-parallel@1.2.6 --save-dev
```

Cucumber 7
``` bash
npm install cucumberjs-parallel --save-dev
```
***Notes:*** 

* The versions 1.x.x were tested with cucumberjs v6.0.5 and Node v12.
* The versions 2.x.x were tested with cucumberjs v7.3.1 and Node v14.16.0.
* The module requires node v.^10, if you are using v10, please use `--experimental-worker` flag. [Details][3]

## How to use

### Commands

* `--parallel-type` - either `features` or `scenarios`
* `-w, --workers` - number of threads. if the value set to 0, the count of threads will equal the number of tasks (features or scenarios)

To run `Scenarios` in Parallel, pass process.argv `--parallel-type scenarios`


``` bash
$ node_modules/cucumberjs-parallel/bin/cucumberjs-parallel /path/to/features -r /path/to/step-defs --parallel-type scenarios -w 4 --format json:path/to/file.json
```


It runs `Features` in parallel by default, or by passing `--parallel-type features` process argument


``` bash
$ node_modules/cucumberjs-parallel/bin/cucumberjs-parallel /path/to/features -r /path/to/step-defs -w 0 --format json:path/to/file.json
```


## Run

Supports all the arguments as [cucumber-js][1], however please be careful with `--format` option, the module supports aggregation of `json`. the rest of formats might not be working.  

``` bash
$ node_modules/cucumberjs-parallel/bin/cucumberjs-parallel /path/to/features -r /path/to/step-defs -w 2 -f json:path/to/file.json --tags=@myTag 
```



#### Format
Module supports JSON format. You can save the JSON output to file by passing the cucumber-format as,


```bash
-f json:path/to/file.json
```

### Allure Report

> CucumberJS 7 and higher doesn't work with AllureJS last version (2.0.0-beta.14)

Run Features or Scenarios in Parallel and generate Allure Reports with [allure-cucumberjs][allure-cucumberjs]

Create Reporter file:
```javascript
const { CucumberJSAllureFormatter } = require("allure-cucumberjs");
const { AllureRuntime } = require("allure-cucumberjs");

function Reporter(options) {
  return new CucumberJSAllureFormatter(
    options,
    new AllureRuntime({ resultsDir: "./allure-results" }),
    {}
  );
}
Reporter.prototype = Object.create(CucumberJSAllureFormatter.prototype);
Reporter.prototype.constructor = Reporter;

exports.default = Reporter;
```
Then pass with reporter as a Cucumber formatter:
`--format ./path/to/Reporter.js`

e.g.
```
node_modules/cucumberjs-parallel/bin/cucumberjs-parallel test/features --parallel-type features -w 2 -f allure/Reporter.js
```

## Changelog 

[changelog][changelog]

## Inspired by

* [cucumber-parallel][2] 
* [cucumberjs][1]


[1]: https://github.com/cucumber/cucumber-js "CucumberJs"
[2]: https://github.com/gkushang/cucumber-parallel "Cucumber Parallel"
[3]: https://nodejs.org/docs/latest-v10.x/api/worker_threads.html#

[allure-cucumberjs]: https://github.com/allure-framework/allure-js/tree/master/packages/allure-cucumberjs

[changelog]: https://github.com/vtimonov/cucumberjs-parallel/blob/master/CHANGELOG.md

[travis-shield]: https://api.travis-ci.com/vtimonov/cucumberjs-parallel.svg?branch=master
[travis-link]: https://app.travis-ci.com/github/vtimonov/cucumberjs-parallel

[npm-shield]: https://img.shields.io/npm/v/cucumberjs-parallel.svg
[npm-link]: https://www.npmjs.com/package/cucumberjs-parallel

[depedency-shield]: https://david-dm.org/vtimonov/cucumberjs-parallel/status.svg
[depedency-link]: https://david-dm.org/vtimonov/cucumberjs-parallel

[license-shield]: https://img.shields.io/badge/License-MIT-green.svg
[license-link]: https://github.com/vtimonov/cucumberjs-parallel/blob/master/LICENSE







