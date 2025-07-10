import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { 
  getEstimatedAge, 
  getEstimatedAgeForMultipleNames, 
  makeRawRequest,
  ApiResponse,
  AgifyResponse,
  AgifyErrorResponse
} from '../support/api/agify';
import { logger } from '../support/logger';
import { 
  mockValidName,
  mockNameWithNumbers,
  mockNameWithDiacritics,
  mockNameWithCountry,
  mockBatchRequest,
  mockMissingName,
  mockRateLimitExceeded,
  mockRateLimitHeaders,
  mockInvalidApiKey,
  mockBatchTooLarge,
  mockEmptyNameList,
  mockSpecialCharacters,
  mockVeryLongName,
  mockBatchWithCountry
} from '../support/mocks/agifyApi.mock';

let response: ApiResponse;

// Given steps
Given('I have the name {string}', function (inputName: string) {
    this.name = inputName;
    this.country = undefined;
    this.names = undefined;
    logger.debug('Set single name', { name: inputName });
    
    // Set up mocks based on the name when using mock mode
    if (process.env.USE_MOCK === 'true') {
        switch (inputName) {
            case 'michael':
                mockValidName();
                break;
            case 'john123':
                mockNameWithNumbers();
                break;
            case 'rené':
                mockNameWithDiacritics();
                break;
            case 'peter':
                mockNameWithCountry();
                break;
            case 'test':
                // Different mocks for different scenarios with same name
                if (this.apiKey) {
                    mockInvalidApiKey();
                } else {
                    mockRateLimitHeaders();
                }
                break;
            case 'josé':
                mockSpecialCharacters();
                break;
            default:
                logger.warn('No mock configured for name:', inputName);
        }
    }
});

Given('I have the names {string}', function (inputNames: string) {
    this.names = inputNames.split(',');
    this.name = undefined;
    logger.debug('Set multiple names', { names: this.names });
    
    // Set up mocks for batch requests when using mock mode
    if (process.env.USE_MOCK === 'true') {
        if (inputNames === 'alice,bob') {
            mockBatchRequest();
        } else if (inputNames === 'maria,carlos') {
            mockBatchWithCountry();
        }
    }
});

Given('I have the country {string}', function (country: string) {
    this.country = country;
    logger.debug('Set country', { country });
});

Given('I have no name', function () {
    this.name = undefined;
    this.names = undefined;
    logger.debug('Set no name');
    
    if (process.env.USE_MOCK === 'true') {
        mockMissingName();
    }
});

Given('I have an invalid API key {string}', function (apiKey: string) {
    this.apiKey = apiKey;
    logger.debug('Set invalid API key', { apiKey });
    
    if (process.env.USE_MOCK === 'true') {
        mockInvalidApiKey();
    }
});

Given('I have too many names in batch', function () {
    this.names = Array.from({ length: 11 }, (_, i) => `name${i}`);
    logger.debug('Set too many names', { count: this.names.length });
    
    if (process.env.USE_MOCK === 'true') {
        mockBatchTooLarge();
    }
});

Given('I have an empty list of names', function () {
    this.names = [];
    logger.debug('Set empty names list');
    
    if (process.env.USE_MOCK === 'true') {
        mockEmptyNameList();
    }
});

Given('I have a very long name', function () {
    this.name = 'a'.repeat(256);
    logger.debug('Set very long name', { length: this.name.length });
    
    if (process.env.USE_MOCK === 'true') {
        mockVeryLongName();
    }
});

// Special step for rate limit testing
Given('I have the name {string} for rate limit testing', function (inputName: string) {
    this.name = inputName;
    logger.debug('Set name for rate limit testing', { name: inputName });
    
    if (process.env.USE_MOCK === 'true') {
        mockRateLimitExceeded();
    }
});

// When steps
When('I send a GET request to the Agify API', async function () {
    logger.debug({ name: this.name, country: this.country, apiKey: this.apiKey }, 'Sending Agify request');
    if (this.name !== undefined) {
        response = await getEstimatedAge(this.name, this.country, this.apiKey);
    } else if (this.names !== undefined) {
        response = await getEstimatedAgeForMultipleNames(this.names, this.country);
    } else {
        // For testing missing name parameter
        response = await makeRawRequest('https://api.agify.io');
    }
    logger.debug({ status: response.status, data: response.data }, 'Received response');
});

// Then steps
Then('the response status should be {int}', function (expectedStatus: number) {
    logger.debug('Checking status', { expected: expectedStatus, actual: response.status });
    expect(response.status).to.equal(expectedStatus);
});

Then('the response should contain a name', function () {
    const data = response.data as AgifyResponse;
    logger.debug('Checking name presence', { name: data.name });
    expect(data).to.have.property('name');
    expect(data.name).to.be.a('string');
});

Then('the response should contain an age', function () {
    const data = response.data as AgifyResponse;
    logger.debug('Checking age presence', { age: data.age });
    expect(data).to.have.property('age');
    expect(data.age).to.satisfy((age: any) => age === null || typeof age === 'number');
});

Then('the response should contain a country', function () {
    const data = response.data as AgifyResponse;
    logger.debug('Checking country presence', { country: data.country_id });
    expect(data).to.have.property('country_id');
    expect(data.country_id).to.be.a('string');
});

Then('the age should be null or a number', function () {
    const data = response.data as AgifyResponse;
    logger.debug('Checking age type', { age: data.age, type: typeof data.age });
    expect(data.age).to.satisfy((age: any) => age === null || typeof age === 'number');
});

Then('the response should be an array', function () {
    logger.debug('Checking array type', { isArray: Array.isArray(response.data) });
    expect(response.data).to.be.an('array');
});

Then('each item should contain a name and age', function () {
    const data = response.data as AgifyResponse[];
    logger.debug('Checking array items', { count: data.length });
    expect(data).to.be.an('array');
    data.forEach((item, index) => {
        logger.debug(`Checking item ${index}`, { item });
        expect(item).to.have.property('name');
        expect(item).to.have.property('age');
        expect(item.name).to.be.a('string');
        expect(item.age).to.satisfy((age: any) => age === null || typeof age === 'number');
    });
});

Then('each item should contain a country', function () {
    const data = response.data as AgifyResponse[];
    logger.debug('Checking country in array items', { count: data.length });
    expect(data).to.be.an('array');
    data.forEach((item, index) => {
        logger.debug(`Checking country in item ${index}`, { item });
        expect(item).to.have.property('country_id');
        expect(item.country_id).to.be.a('string');
    });
});

Then('the response should contain error {string}', function (expectedError: string) {
    const data = response.data as AgifyErrorResponse;
    logger.debug('Checking error message', { expected: expectedError, actual: data.error });
    expect(data).to.have.property('error');
    expect(data.error).to.equal(expectedError);
});

Then('the response should include rate limit headers', function () {
    logger.debug('Checking rate limit headers', { headers: response.headers });
    expect(response.headers).to.have.property('x-rate-limit-limit');
    expect(response.headers).to.have.property('x-rate-limit-remaining');
    expect(response.headers).to.have.property('x-rate-limit-reset');
});