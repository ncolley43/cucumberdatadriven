import { defineParameterType, Given, Then } from '@cucumber/cucumber';
import { expect, Locator } from '@playwright/test';
import { ManufacturerPage } from '../pages/ManufacturerPage';
import { findCompany } from '../test-data/companies';
import { CustomWorld } from '../support/world';

/** How long to wait for an element before reporting it as not found. */
const READ_TIMEOUT = 10_000;

/** Which test-data file each kind of company is read from. */
const DATA_FILES: Record<string, string> = {
  manufacturer: 'manufacturers.json',
  partner: 'partners.json',
};

defineParameterType({
  name: 'companyType',
  regexp: /manufacturer|partner/,
});

async function readText(locator: Locator): Promise<string | null> {
  return (await locator.innerText({ timeout: READ_TIMEOUT }).catch(() => null))?.trim() ?? null;
}

async function readAttribute(locator: Locator, name: string): Promise<string | null> {
  return locator.getAttribute(name, { timeout: READ_TIMEOUT }).catch(() => null);
}

/**
 * Compares an expected value with the value read from the page. The comparison is shown
 * ("Expected ... | Actual ...") under the step in the HTML report, and printed to the console.
 */
function expectValue(world: CustomWorld, label: string, expected: string, actual: string | null) {
  const shownActual = actual ?? '(not found)';
  console.log(`${label}\n  Expected: ${expected}\n  Actual:   ${shownActual}`);
  world.log(`${label} | Expected: "${expected}" | Actual: "${shownActual}"`);
  expect(actual, label).toBe(expected);
}

/** Optional fields are only checked when they are present in the test data. */
function notInData(world: CustomWorld, label: string) {
  world.log(`${label} | not in the test data, not checked`);
}

Given(
  'I open the {companyType} overview page for {string}',
  async function (this: CustomWorld, companyType: string, name: string) {
    this.company = findCompany(DATA_FILES[companyType], name);
    this.overviewPage = new ManufacturerPage(this.page);
    await this.overviewPage.goto(this.company.path);
  },
);

Then('the page shows the name', async function (this: CustomWorld) {
  const { name } = this.overviewPage;
  expectValue(this, 'Name', this.company.name, await readText(name));
  await expect(name).toBeVisible();
});

Then('the page shows the tagline', async function (this: CustomWorld) {
  const { tagline } = this.company;
  if (!tagline) return notInData(this, 'Tagline');
  expectValue(this, 'Tagline', tagline, await readText(this.overviewPage.tagline));
  await expect(this.overviewPage.tagline).toBeVisible();
});

Then('the page shows the phone number', async function (this: CustomWorld) {
  const { phone } = this.company;
  if (!phone) return notInData(this, 'Phone number');
  const { phoneLink } = this.overviewPage;
  expectValue(this, 'Phone number', phone, await readText(phoneLink));
  expectValue(this, 'Phone link', `tel:${phone}`, await readAttribute(phoneLink, 'href'));
  await expect(phoneLink).toBeVisible();
});

Then('the page shows the website link', async function (this: CustomWorld) {
  const { website } = this.company;
  if (!website) return notInData(this, 'Website link');
  const { websiteLink } = this.overviewPage;
  expectValue(this, 'Website link', website, await readAttribute(websiteLink, 'href'));
  await expect(websiteLink).toBeVisible();
});

Then('the page shows the contact button', async function (this: CustomWorld) {
  const { contactButton } = this.company;
  if (!contactButton) return notInData(this, 'Contact button');
  expectValue(this, 'Contact button', contactButton, await readText(this.overviewPage.contactButton));
  await expect(this.overviewPage.contactButton).toBeVisible();
});

/** Checks every social link before failing, so one run reports all the mismatches. */
Then('the page shows the social media links', async function (this: CustomWorld) {
  const socialLinks = this.company.socialLinks ?? [];
  if (socialLinks.length === 0) return notInData(this, 'Social media links');

  const failures: string[] = [];
  for (const social of socialLinks) {
    const label = `${social.platform} link`;
    const link = this.overviewPage.socialLink(social.platform);
    try {
      expectValue(this, label, social.url, await readAttribute(link, 'href'));
      await expect(link).toBeVisible();
    } catch (error) {
      failures.push(`${label}: ${(error as Error).message}`);
    }
  }
  if (failures.length > 0) {
    throw new Error(`${failures.length} social link check(s) failed:\n\n${failures.join('\n\n')}`);
  }
});
