const { CucumberJSAllureFormatter, CucumberJSAllureFormatterConfig } = require('allure-cucumberjs');
const { AllureRuntime } = require('allure-js-commons');

class AllureFormatter extends CucumberJSAllureFormatter {
  constructor(options) {
    const config = new CucumberJSAllureFormatterConfig({});
    super(
      options,
      new AllureRuntime({ resultsDir: 'allure-results' }),
      config
    );
  }
}

module.exports = AllureFormatter; 