import { IWorldOptions, setWorldConstructor, World, Before, AfterAll, BeforeAll } from '@cucumber/cucumber';
import nock from 'nock';

export class CustomWorld extends World {
    name: string | string[] = '';
    countryId?: string;
    response: any = null;
    apiKey?: string;
  
    constructor(options: IWorldOptions) {
      super(options);
    }
}
  
setWorldConstructor(CustomWorld);

// Enable nock when using mocks
BeforeAll(function () {
  if (process.env.USE_MOCK === 'true') {
    nock.disableNetConnect();
  }
});

// Clean up nock after each scenario when using mocks
Before(function () {
  if (process.env.USE_MOCK === 'true') {
    nock.cleanAll();
  }
});

// Clean up nock completely after all tests
AfterAll(function () {
  if (process.env.USE_MOCK === 'true') {
    nock.cleanAll();
    nock.enableNetConnect();
  }
}); 