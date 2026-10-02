# cucumberdatadriven

Data-driven Cucumber + Playwright tests for manufacturer and partner overview pages on [NBS Source](https://source.thenbs.com).
It is the Cucumber version of [PlaywrightDataDriven](https://github.com/ncolley43/PlaywrightDataDriven).

## Layout

| Folder | Contents |
| --- | --- |
| `features/` | Gherkin scenarios. Each `Examples` row is a company name to check |
| `test-data/` | Expected page content per company (`manufacturers.json`, `partners.json`) |
| `steps/` | Step definitions that compare the test data with the page |
| `pages/` | Page object for the overview page |
| `support/` | Cucumber World and browser hooks |

Optional fields (tagline, phone, website, contact button, social links) are only checked when they are present in the test data.

## Adding a company

1. Add its expected details to `test-data/manufacturers.json` or `test-data/partners.json`.
2. Add its name, exactly as in the JSON, to the `Examples` table in the matching feature file.

## Running

```bash
npm ci
npx playwright install chromium

npm test                     # all scenarios, headless
npm run test:head            # with a visible browser
npm run test:manufacturers   # only @manufacturer scenarios
npm run test:partners        # only @partner scenarios
```

The HTML report is written to `reports/cucumber-report.html`. It shows each Expected/Actual comparison under its step, and a screenshot for any failed scenario.

Every test run also builds a dashboard with charts and per-feature summaries at `reports/dashboard/index.html` ([multiple-cucumber-html-reporter](https://github.com/WasiqB/multiple-cucumber-html-reporter)). It is built from `reports/json/cucumber-report.json` even when scenarios fail. To rebuild it without rerunning the tests, use `npm run report`.
