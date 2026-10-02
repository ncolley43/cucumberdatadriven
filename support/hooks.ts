import { After, AfterAll, Before, setDefaultTimeout, Status } from '@cucumber/cucumber';
import { Browser, chromium, devices } from '@playwright/test';
import { CustomWorld } from './world';

const BASE_URL = 'https://source.thenbs.com';

/* Page loads on NBS Source can be slow, so allow each step up to a minute */
setDefaultTimeout(60_000);

/* One browser for the whole run; each scenario gets a fresh context (cookies, storage) */
let browser: Browser | undefined;

Before(async function (this: CustomWorld) {
  browser ??= await chromium.launch({ headless: !this.parameters.headed });
  this.context = await browser.newContext({ ...devices['Desktop Chrome'], baseURL: BASE_URL });
  this.page = await this.context.newPage();
});

After(async function (this: CustomWorld, { result }) {
  if (result?.status === Status.FAILED && this.page) {
    const screenshot = await this.page.screenshot({ fullPage: true }).catch(() => null);
    if (screenshot) {
      this.attach(screenshot, 'image/png');
    }
  }
  await this.context?.close();
});

AfterAll(async function () {
  await browser?.close();
});
