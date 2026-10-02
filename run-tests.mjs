/**
 * Runs cucumber-js with any arguments passed in, then always builds the HTML dashboard,
 * even when scenarios fail. Exits with Cucumber's exit code so CI still fails on test failures.
 *
 * npm's "posttest" hook can't be used for this because it is skipped when the tests fail.
 */
import { spawnSync } from 'node:child_process';
import { generateReport } from './report.mjs';

/* Call Cucumber's CLI script directly (no shell) so arguments such as --world-parameters JSON pass through untouched */
const cucumberCli = 'node_modules/@cucumber/cucumber/bin/cucumber.js';
const { status } = spawnSync(process.execPath, [cucumberCli, ...process.argv.slice(2)], { stdio: 'inherit' });

try {
  await generateReport();
} catch (error) {
  console.error('Could not build the HTML dashboard:', error);
}

process.exit(status ?? 1);
