/**
 * Cucumber configuration. See https://github.com/cucumber/cucumber-js/blob/main/docs/configuration.md
 */
module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    /* Compile the TypeScript step definitions and support code on the fly */
    requireModule: ['ts-node/register'],
    require: ['support/**/*.ts', 'steps/**/*.ts'],
    /* Readable output in the console, full report in reports/ */
    format: [
      'progress',
      'summary',
      'html:reports/cucumber-report.html',
      'json:reports/json/cucumber-report.json',
    ],
    formatOptions: { snippetInterface: 'async-await' },
    /* Retry on CI only */
    retry: process.env.CI ? 2 : 0,
    /* Fail the build on CI if any step is undefined or pending */
    strict: true,
    /* Scenarios run one after another (one browser session at a time) */
    parallel: 0,
  },
};
