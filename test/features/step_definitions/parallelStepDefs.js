const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');


Given(/^Fred has multiple (?:features|scenarios) written in cucumber$/, function (callback) {
    this.attach('', 'image/png');
    callback();
});

When(/^he runs the features in parallel with "([^"]*)" using cucumber\-parallel module$/, function (testData, callback) {
    this.attach(testData);
    callback();
});

Then(/^all the (?:features|scenarios) should run in parallel$/, function (callback) {
    callback();
});

When(/^Fred has scenario outline with the "([^"]*)"$/, function (id, callback) {
    callback();
});

Given(/^Fred has a step with below data table$/, function (table, callback) {
    callback();
});

Then(/^all the (?:features|scenarios) should fail$/, function () {
    assert.fail('I m a failed test');
});