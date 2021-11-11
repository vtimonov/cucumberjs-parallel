const chai = require('chai');
const fs = require('fs-extra');
const deepEqualInAnyOrder = require('deep-equal-in-any-order');

chai.use(deepEqualInAnyOrder);

const {expect} = chai;

const dirPath = 'test/report/';

const cucumberjsReportJson = 'cucumber_report0.json';
const cucumberParallelFeaturesReportJson = 'cucumber_report1.json';
const cucumberParallelScenariosReportJson = 'cucumber_report2.json';

const getData = function () {
    const expectedJson = fs.readJsonSync(dirPath + cucumberjsReportJson);
    const actualFeaturesJson = fs.readJsonSync(dirPath + cucumberParallelFeaturesReportJson);
    const actualScenariosJson = fs.readJsonSync(dirPath + cucumberParallelScenariosReportJson);

    return {
        expectedJson: expectedJson,
        featuresJson: actualFeaturesJson,
        scenariosJson: actualScenariosJson,
    };
};

const testData = getData();

function setDurationToZero(cases) {
    cases.forEach(tCase => {
        tCase.steps.forEach(step => {
            step.result.duration = 0;
        });
    });
}

const expected = testData.expectedJson;
const actual = testData.featuresJson;

let expectedfeature1, expectedfeature2, actualfeature1, actualfeature2;


expected.forEach(value => {
    if ('Cucumber Parallel Set One' === value.name) {
        expectedfeature1 = value;
    }
    if ('Cucumber Parallel Set Two' === value.name) {
        expectedfeature2 = value;
    }
});

actual.forEach(value => {
    if (value.name === 'Cucumber Parallel Set One') {
        actualfeature1 = value;
    }
    if (value.name === 'Cucumber Parallel Set Two') {
        actualfeature2 = value;
    }
});

describe('Check that json report for parallel features is equal standard cucumber report.', () => {
    it('feature 1 main data should be the same', () => {
        const feature1 = Object.assign({}, expectedfeature1);
        delete feature1.elements;
        const feature2 = Object.assign({}, actualfeature1);
        delete feature2.elements;
        expect(feature1).to.deep.equalInAnyOrder(feature2);
    });
    it('feature 2 main data should be the same', () => {
        const feature1 = Object.assign({}, expectedfeature2);
        delete feature1.elements;
        const feature2 = Object.assign({}, actualfeature2);
        delete feature2.elements;
        expect(feature1).to.deep.equalInAnyOrder(feature2);
    });
    it('feature 1 test cases data should be the same', () => {
        const elements1 = Object.assign([], expectedfeature1.elements);
        const elements2 = Object.assign([], actualfeature1.elements);

        //Remove duration as it's dynamic value
        setDurationToZero(elements1);
        setDurationToZero(elements2);

        expect(elements1).to.deep.equalInAnyOrder(elements2);
    });
    it('feature 2 test cases data should be the same', () => {
        const elements1 = Object.assign([], expectedfeature2.elements);
        const elements2 = Object.assign([], actualfeature2.elements);

        //Remove duration as it's dynamic value
        setDurationToZero(elements1);
        setDurationToZero(elements2);

        expect(elements1).to.deep.equalInAnyOrder(elements2);
    });
});


describe('Check that json report for parallel scenarios is equal standard cucumber report.', () => {
    it('feature 1 main data should be the same', () => {
        const feature1 = Object.assign({}, expectedfeature1);
        delete feature1.elements;
        const feature2 = Object.assign({}, actualfeature1);
        delete feature2.elements;
        expect(feature1).to.deep.equalInAnyOrder(feature2);
    });
    it('feature 2 main data should be the same', () => {
        const feature1 = Object.assign({}, expectedfeature2);
        delete feature1.elements;
        const feature2 = Object.assign({}, actualfeature2);
        delete feature2.elements;
        expect(feature1).to.deep.equalInAnyOrder(feature2);
    });
    it('feature 1 test cases data should be the same', () => {
        const elements1 = Object.assign([], expectedfeature1.elements);
        const elements2 = Object.assign([], actualfeature1.elements);

        // Remove duration as it's dynamic value
        setDurationToZero(elements1);
        setDurationToZero(elements2);

        expect(elements1).to.deep.equalInAnyOrder(elements2);
    });
    it('feature 2 test cases data should be the same', () => {
        const elements1 = Object.assign([], expectedfeature2.elements);
        const elements2 = Object.assign([], actualfeature2.elements);

        // Remove duration as it's dynamic value
        setDurationToZero(elements1);
        setDurationToZero(elements2);

        expect(elements1).to.deep.equalInAnyOrder(elements2);
    });
});