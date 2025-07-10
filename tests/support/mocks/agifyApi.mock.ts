import nock from 'nock';

const API_URL = 'https://api.agify.io';

export function mockAgifyResponse(name: string, age: number | null, count: number) {
  return nock(API_URL)
    .get('/')
    .query({ name })
    .reply(200, {
      name,
      age,
      count,
    });
}

export function mockValidName() {
  return mockAgifyResponse('michael', 35, 12345);
}

export function mockNameWithNumbers() {
  return mockAgifyResponse('john123', null, 0);
}

export function mockNameWithDiacritics() {
  return mockAgifyResponse('rené', 45, 8901);
}

export function mockNameWithCountry() {
  return nock(API_URL)
    .get('/')
    .query({ name: 'peter', country_id: 'US' })
    .reply(200, {
      name: 'peter',
      age: 42,
      count: 15678,
      country_id: 'US'
    });
}

export function mockBatchRequest() {
  return nock(API_URL)
    .get('/')
    .query({ 'name[]': ['alice', 'bob'] })
    .reply(200, [
      { name: 'alice', age: 30, count: 5000 },
      { name: 'bob', age: 25, count: 3000 }
    ]);
}

export function mockError(query: any, errorMessage: string, statusCode: number) {
  return nock(API_URL)
    .get('/')
    .query(query)
    .reply(statusCode, {
      error: errorMessage
    });
}

export function mockMissingName() {
  return mockError({}, "Missing 'name' parameter", 422);
}

export function mockRateLimitExceeded() {
  return mockError({ name: 'test' }, 'Request limit reached', 429);
}

export function mockRateLimitHeaders() {
  return nock(API_URL)
    .get('/')
    .query({ name: 'test' })
    .reply(200, {
      name: 'test',
      age: 30,
      count: 1000
    }, {
      'X-Rate-Limit-Limit': '1000',
      'X-Rate-Limit-Remaining': '999',
      'X-Rate-Limit-Reset': '86400'
    });
}

// --- Mocks for New Scenarios ---

export function mockInvalidApiKey() {
  return mockError({ name: 'test', apikey: 'INVALID_KEY' }, 'Invalid API key', 401);
}

export function mockBatchTooLarge() {
  return nock(API_URL)
    .get('/')
    .query(true) // Match any query parameters
    .reply(422, {
      error: "Invalid 'name' parameter"
    });
}

export function mockEmptyNameList() {
  return nock(API_URL)
    .get('/')
    .query(true) // Match any query parameters
    .reply(422, {
      error: "Invalid 'name' parameter"
    });
}

export function mockSpecialCharacters() {
  return mockAgifyResponse('josé', 38, 2500);
}

export function mockVeryLongName() {
  const longName = 'a'.repeat(256);
  return mockError({ name: longName }, "Invalid 'name' parameter", 422);
}

export function mockBatchWithCountry() {
  return nock(API_URL)
    .get('/')
    .query({ 'name[]': ['maria', 'carlos'], country_id: 'BR' })
    .reply(200, [
      { name: 'maria', age: 35, count: 8000, country_id: 'BR' },
      { name: 'carlos', age: 40, count: 6000, country_id: 'BR' }
    ]);
} 