import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { getEstimatedAge } from '../support/api/agify';

let response: any;

Given('I have the name {string}', function (inputName: string) {
    this.name = inputName;
});

Given('I have no name', function () {
    this.name = '';
});

When('I send a GET request to the Agify API', async function () {
    response = await getEstimatedAge(this.name);
});

Then('the response status should be {int}', function (expectedStatus: number) {
    expect(response.status).to.equal(expectedStatus);
});

Then('the response should contain a name', function () {
    expect(response.data).to.have.property('name');
    expect(response.data.name).to.be.a('string');
});

Then('the response should contain an age', function () {
    expect(response.data).to.have.property('age');
    expect(response.data.age).to.satisfy((age: any) => 
        age === null || typeof age === 'number'
    );
});

Then('the age should be null or a number', function () {
    expect(response.data.age).to.satisfy((age: any) => 
        age === null || typeof age === 'number'
    );
});