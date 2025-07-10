import nock from 'nock';

const API_URL = 'https://api.agify.io';

// --- Generic Mock Builders ---

function mockSuccess(query: nock.DataMatcherMap, responseBody: object, statusCode = 200) {
  return nock(API_URL)
    .get('/')
    .query(query)
    .reply(statusCode, responseBody);
}

function mockError(query: nock.DataMatcherMap | null, errorMessage: string, statusCode: number) {
  const request = nock(API_URL).get('/');
  
  if (query) {
    request.query(query);
  }

  return request.reply(statusCode, { error: errorMessage });
}

// --- Specific Scenario Mocks ---

export function mockValidName() {
  return mockSuccess({ name: 'michael' }, { name: 'michael', age: 35, count: 12345 });
}

export function mockNameWithNumbers() {
  return mockSuccess({ name: 'john123' }, { name: 'john123', age: null, count: 0 });
}

export function mockMissingName() {
  // The agify API returns 422 for a request to the base URL without query params
  return mockError(null, "Missing 'name' parameter", 422);
}

export function mockEmptyName() {
    return mockSuccess({ name: '' }, { name: '', age: null, count: 0 });
}

export function mockNameWithCountry() {
  return mockSuccess({ name: 'michael', country_id: 'US' }, { name: 'michael', age: 45, count: 54321, country_id: 'US' });
}

export function mockBatchRequest() {
  const names = ['michael', 'matthew', 'jane'];
  const query = { 'name[]': names };
  const response = [
    { name: 'michael', age: 35, count: 12345 },
    { name: 'matthew', age: 40, count: 67890 },
    { name: 'jane', age: 30, count: 98765 }
  ];
  return nock(API_URL)
    .get('/')
    .query(query)
    .reply(200, response);
}

export function mockRateLimitHeaders() {
  return nock(API_URL)
    .get('/')
    .query({ name: 'test' })
    .reply(200, 
      { name: 'test', age: 50, count: 1 }, 
      {
        'X-Rate-Limit-Limit': '1000',
        'X-Rate-Limit-Remaining': '999',
        'X-Rate-Limit-Reset': '86400'
      }
    );
} 

// --- Mocks for New Scenarios ---

export function mockInvalidApiKey() {
  return mockError({ name: 'test', apikey: 'INVALID_KEY' }, 'Invalid API key', 401);
}

export function mockBatchTooLarge() {
  const names = Array.from({ length: 11 }, (_, i) => `name${i}`);
  const query = { 'name[]': names };
  return mockError(query, "Invalid 'name' parameter", 422);
}

export function mockEmptyBatchRequest() {
  return mockError({ 'name[]': [] }, "Missing 'name' parameter", 422);
}

export function mockNameWithDiacritics() {
  return mockSuccess({ name: 'René' }, { name: 'René', age: 64, count: 123 });
}

export function mockRateLimitExceeded() {
  return mockError({ name: 'test' }, 'Request limit reached', 429);
}

export function mockBatchWithCountry() {
  const names = ['michael', 'sofia'];
  const query = { 'name[]': names, country_id: 'US' };
  const response = [
    { name: 'michael', age: 45, count: 54321, country_id: 'US' },
    { name: 'sofia', age: 30, count: 9876, country_id: 'US' }
  ];
  return nock(API_URL)
    .get('/')
    .query(query)
    .reply(200, response);
} 