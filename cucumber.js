module.exports = {
  default: {
    paths: ['tests/features/**/*.feature'],
    requireModule: ['ts-node/register'],
    require: [
      'tests/step_definitions/**/*.ts',
      'tests/support/**/*.ts'
    ],
    format: [
      'progress-bar',
      './allure-formatter.js'
    ],
    formatOptions: {
      resultsDir: 'allure-results'
    }
  }
}; 