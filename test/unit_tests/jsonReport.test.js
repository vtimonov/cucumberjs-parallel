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

function setDurationToZero(cases) {
    cases.forEach(tCase => {
        tCase.steps.forEach(step => {
            step.result.duration = 0;
        });
    });
}

describe('Check that json report for parallel features is equal standard cucumber report.', () => {
    const expected = getData().expectedJson;
    const actual = getData().featuresJson;

    let exfeature1, exfeature2, afeature1, afeature2;


    expected.forEach(value => {
        if (value.name === "Cucumber Parallel Set One") {
            exfeature1 = value;
        }
        if (value.name === "Cucumber Parallel Set Two") {
            exfeature2 = value;
        }
    });

    actual.forEach(value => {
        if (value.name === "Cucumber Parallel Set One") {
            afeature1 = value;
        }
        if (value.name === "Cucumber Parallel Set Two") {
            afeature2 = value;
        }
    });

    it('feature 1 main data should be the same', () => {
        const feature1 = Object.assign({}, exfeature1);
        delete feature1.elements;
        const feature2 = Object.assign({}, afeature1);
        delete feature2.elements;
        expect(feature1).to.deep.equalInAnyOrder(feature2);
    });
    it('feature 2 main data should be the same', () => {
        const feature1 = Object.assign({}, exfeature2);
        delete feature1.elements;
        const feature2 = Object.assign({}, afeature2);
        delete feature2.elements;
        expect(feature1).to.deep.equalInAnyOrder(feature2);
    });
    it('feature 1 test cases data should be the same', () => {
        const elements1 = Object.assign([], exfeature1.elements);
        const elements2 = Object.assign([], afeature1.elements);

        //Remove duration as it's dynamic value
        setDurationToZero(elements1);
        setDurationToZero(elements2);

        expect(elements1).to.deep.equalInAnyOrder(elements2);
    });
    it('feature 2 test cases data should be the same', () => {
        const elements1 = Object.assign([], exfeature2.elements);
        const elements2 = Object.assign([], afeature2.elements);

        //Remove duration as it's dynamic value
        setDurationToZero(elements1);
        setDurationToZero(elements2);

        expect(elements1).to.deep.equalInAnyOrder(elements2);
    });
});


describe('Check that json report for parallel scenarios is equal standard cucumber report.', () => {
    const expected = getData().expectedJson;
    const actual = getData().scenariosJson;

    let exfeature1, exfeature2, afeature1, afeature2;


    expected.forEach(value => {
        if (value.name === 'Cucumber Parallel Set One') {
            exfeature1 = value;
        }
        if (value.name === 'Cucumber Parallel Set Two') {
            exfeature2 = value;
        }
    });

    actual.forEach(value => {
        if (value.name === 'Cucumber Parallel Set One') {
            afeature1 = value;
        }
        if (value.name === 'Cucumber Parallel Set Two') {
            afeature2 = value;
        }
    });

    it('feature 1 main data should be the same', () => {
        const feature1 = Object.assign({}, exfeature1);
        delete feature1.elements;
        const feature2 = Object.assign({}, afeature1);
        delete feature2.elements;
        expect(feature1).to.deep.equalInAnyOrder(feature2);
    });
    it('feature 2 main data should be the same', () => {
        const feature1 = Object.assign({}, exfeature2);
        delete feature1.elements;
        const feature2 = Object.assign({}, afeature2);
        delete feature2.elements;
        expect(feature1).to.deep.equalInAnyOrder(feature2);
    });
    it('feature 1 test cases data should be the same', () => {
        const elements1 = Object.assign([], exfeature1.elements);
        const elements2 = Object.assign([], afeature1.elements);

        // Remove duration as it's dynamic value
        setDurationToZero(elements1);
        setDurationToZero(elements2);

        expect(elements1).to.deep.equalInAnyOrder(elements2);
    });
    it('feature 2 test cases data should be the same', () => {
        const elements1 = Object.assign([], exfeature2.elements);
        const elements2 = Object.assign([], afeature2.elements);

        // Remove duration as it's dynamic value
        setDurationToZero(elements1);
        setDurationToZero(elements2);

        expect(elements1).to.deep.equalInAnyOrder(elements2);
    });
});