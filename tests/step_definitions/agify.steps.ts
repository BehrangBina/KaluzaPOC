import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import nock from 'nock';
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
  mockMissingName,
  mockEmptyName,
  mockNameWithCountry,
  mockBatchRequest,
  mockRateLimitHeaders,
  mockInvalidApiKey,
  mockBatchTooLarge,
  mockEmptyBatchRequest,
  mockNameWithDiacritics,
  mockRateLimitExceeded,
  mockBatchWithCountry
} from '../support/mocks/agifyApi.mock';

let response: ApiResponse;

// Given steps
Given('I have the name {string}', function (inputName: string) {
    this.name = inputName;
    this.country = undefined;
    this.names = undefined;
    logger.debug({ name: inputName }, 'Set single name');

    if (process.env.USE_MOCK === 'true') {
      switch (inputName) {
        case 'michael':
          // This will be handled in conjunction with the country step
          if (!this.country) mockValidName();
          break;
        case 'john123':
          mockNameWithNumbers();
          break;
        case 'test':
          // This is handled by a separate 'exceeded limit' step
          if (!this.limitExceeded) mockRateLimitHeaders();
          break;
        case 'René':
          mockNameWithDiacritics();
          break;
      }
    }
});

Given('I have no name parameter', function () {
    this.name = undefined;
    this.country = undefined;
    this.names = undefined;
    if (process.env.USE_MOCK === 'true') {
      mockMissingName();
    }
});

Given('I have an empty name {string}', function (inputName: string) {
    this.name = inputName;
    this.country = undefined;
    this.names = undefined;
    if (process.env.USE_MOCK === 'true') {
      mockEmptyName();
    }
});

Given('I specify country {string}', function (country: string) {
    this.country = country;
    if (process.env.USE_MOCK === 'true') {
      if (this.name === 'michael') {
        mockNameWithCountry();
      } else if (this.names) {
        mockBatchWithCountry();
      }
    }
});

Given('I have multiple names {string}', function (namesList: string) {
    this.names = namesList.split(',').map(name => name.trim());
    this.name = undefined;
    this.country = undefined;
    if (process.env.USE_MOCK === 'true' && !this.country) {
      mockBatchRequest();
    }
});

// --- New Given Steps ---

Given('I use an invalid API key {string}', function (apiKey: string) {
  this.apiKey = apiKey;
  if (process.env.USE_MOCK === 'true') {
    mockInvalidApiKey();
  }
});

Given('I have a list of 11 names', function () {
  this.names = Array.from({ length: 11 }, (_, i) => `name${i}`);
  if (process.env.USE_MOCK === 'true') {
    mockBatchTooLarge();
  }
});

Given('I have an empty list of names', function () {
  this.names = [];
  if (process.env.USE_MOCK === 'true') {
    mockMissingName(); // Use the correct, existing mock
  }
});

Given('I have exceeded my request limit', function () {
  this.limitExceeded = true;
  if (process.env.USE_MOCK === 'true') {
    nock.cleanAll(); // Clean up previous mocks
    mockRateLimitExceeded();
  }
});


// When steps
When('I send a GET request to the Agify API', async function () {
    logger.debug({ name: this.name, country: this.country, apiKey: this.apiKey }, 'Sending Agify request');
    if (this.name !== undefined) {
        response = await getEstimatedAge(this.name, this.country, this.apiKey);
    } else {
        // For testing missing name parameter
        response = await makeRawRequest('https://api.agify.io');
    }
    logger.debug({ status: response.status, data: response.data }, 'Received response');
});

When('I send a batch GET request to the Agify API', async function () {
    logger.debug({ names: this.names, country: this.country }, 'Sending batch Agify request');
    if (this.names && Array.isArray(this.names)) {
        response = await getEstimatedAgeForMultipleNames(this.names, this.country);
    } else {
        throw new Error('No names array provided for batch request');
    }
    logger.debug({ status: response.status, data: response.data }, 'Received batch response');
});

// Then steps for status
Then('the response status should be {int}', function (expectedStatus: number) {
    expect(response.status).to.equal(expectedStatus);
});

// Then steps for success responses
Then('the response should contain a name {string}', function (expectedName: string) {
    expect(response.data).to.have.property('name');
    expect((response.data as AgifyResponse).name).to.equal(expectedName);
});

Then('the response should contain an age', function () {
    logger.debug({ data: response.data }, 'Validating age field');
    expect(response.data).to.have.property('age');
    const age = (response.data as AgifyResponse).age;
    expect(age).to.satisfy((value: any) => value === null || typeof value === 'number');
});

Then('the response should contain a count', function () {
    expect(response.data).to.have.property('count');
    expect((response.data as AgifyResponse).count).to.be.a('number');
    expect((response.data as AgifyResponse).count).to.be.at.least(0);
});

Then('the response should contain a count {int}', function (expectedCount: number) {
    expect(response.data).to.have.property('count');
    expect((response.data as AgifyResponse).count).to.equal(expectedCount);
});

Then('the response should contain null age', function () {
    expect(response.data).to.have.property('age');
    expect((response.data as AgifyResponse).age).to.be.null;
});

Then('the age should be null or a number', function () {
    expect(response.data).to.have.property('age');
    const age = (response.data as AgifyResponse).age;
    expect(age).to.satisfy((value: any) => value === null || typeof value === 'number');
});

// Then steps for error responses
Then('the response should contain error {string}', function (expectedError: string) {
    expect(response.data).to.have.property('error');
    expect((response.data as AgifyErrorResponse).error).to.equal(expectedError);
});

// Then steps for batch responses
Then('the response should be an array of {int} predictions', function (expectedCount: number) {
    expect(response.data).to.be.an('array');
    expect((response.data as AgifyResponse[]).length).to.equal(expectedCount);
});

Then('each prediction should contain name and age', function () {
    expect(response.data).to.be.an('array');
    const predictions = response.data as AgifyResponse[];
    
    predictions.forEach((prediction) => {
        expect(prediction).to.have.property('name');
        expect(prediction).to.have.property('age');
        expect(prediction).to.have.property('count');
        
        expect(prediction.name).to.be.a('string');
        expect(prediction.age).to.satisfy((value: any) => 
            value === null || typeof value === 'number'
        );
        expect(prediction.count).to.be.a('number');
    });
});

Then('each prediction should have a country_id {string}', function (countryId: string) {
  expect(response.data).to.be.an('array');
  const predictions = response.data as AgifyResponse[];

  predictions.forEach((prediction) => {
    expect(prediction).to.have.property('country_id', countryId);
  });
});

// Then steps for rate limiting
Then('the response should include rate limit headers', function () {
    const headers = response.headers;
    
    // Check for common rate limit headers (exact header names may vary)
    const hasRateLimitHeaders = 
        'x-ratelimit-limit' in headers ||
        'x-ratelimit-remaining' in headers ||
        'x-rate-limit-limit' in headers ||
        'x-rate-limit-remaining' in headers;
    
    expect(hasRateLimitHeaders).to.be.true;
});