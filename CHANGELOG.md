# CHANGELOG

### 1.2.5 (11-03-2020)
* switched to new logger
* handle a case when a feature content missed
* fix an issue with triggering background as a task

### 1.2.1 (10-15-2020)

* Moved to a new [worker pool module][1]
* Fix an issue, when the same thread had cached modules, that caused invalid cucumber cli behaviour (missed hooks, timeouts etc). https://github.com/cucumber/cucumber-js/issues/786#issuecomment-318334193

### 1.0.2 (10-08-2020)

* Initial version


[1]: https://www.npmjs.com/package/workerpool