module.exports = {
  default: [
    'tests/features/**/*.feature',
    '--require-module ts-node/register',
    '--require tests/step_definitions/**/*.ts',
    '--require tests/support/**/*.ts',
    '--format progress-bar',
    '--format @cucumber/pretty-formatter',
    '--format json:reports/cucumber-report.json'
  ].join(' ')
};