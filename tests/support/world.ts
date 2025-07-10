import { IWorldOptions, setWorldConstructor, Before, AfterAll, BeforeAll } from '@cucumber/cucumber';
import nock from 'nock';

export class CustomWorld {
    name: string | string[] = '';
    countryId?: string;
    response: any = null;
    apiKey?: string;
  
    constructor(options: IWorldOptions) {
      // You can use options.parameters if needed
    }
}
  
setWorldConstructor(CustomWorld);

// Conditionally setup hooks for mocking
if (process.env.USE_MOCK === 'true') {
  BeforeAll(function() {
    if (!nock.isActive()) {
      nock.activate();
    }
  });

  Before(function () {
    nock.cleanAll();
  });
  
  AfterAll(function() {
    nock.cleanAll();
    nock.restore();
  });
}