/**
 * Builds the HTML dashboard (reports/dashboard/index.html) from Cucumber's JSON output.
 * See https://github.com/WasiqB/multiple-cucumber-html-reporter
 *
 * Run on its own with `npm run report`, or after the tests via run-tests.mjs.
 */
import os from 'node:os';
import { generate } from 'multiple-cucumber-html-reporter';

export async function generateReport() {
  await generate({
    jsonDir: 'reports/json',
    reportPath: 'reports/dashboard',
    pageTitle: 'NBS Source tests',
    reportName: 'NBS Source manufacturer and partner overview pages',
    displayDuration: true,
    displayReportTime: true,
    externalizeMedia: true,
    metadata: {
      browser: { name: 'chrome', version: 'Playwright Chromium' },
      device: os.hostname(),
      platform: { name: process.platform === 'win32' ? 'windows' : process.platform, version: os.release() },
      executionPlatform: 'local',
    },
    customData: {
      projectName: 'cucumberdatadriven',
      environment: 'https://source.thenbs.com',
      nodeVersion: process.version,
    },
  });
}

/* Running this file directly (npm run report) builds the dashboard straight away */
if (import.meta.url === new URL(`file:///${process.argv[1].replace(/\\/g, '/')}`).href) {
  await generateReport();
}
