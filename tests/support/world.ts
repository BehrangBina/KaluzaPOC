import { IWorldOptions, setWorldConstructor, World } from '@cucumber/cucumber';

export class CustomWorld extends World {
    name: string = '';
    response: any = null;
  
    constructor(options: IWorldOptions) {
      super(options);
    }
  }
  
  setWorldConstructor(CustomWorld);