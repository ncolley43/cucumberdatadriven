import { Locator, Page } from '@playwright/test';

/**
 * Page object for a manufacturer or partner overview page on NBS Source (both use /manufacturer/ URLs).
 * Elements are found by their place in the page header rather than by their expected text,
 * so the tests can report what is actually on the page.
 */
export class ManufacturerPage {
  readonly page: Page;
  readonly header: Locator;
  readonly name: Locator;
  readonly tagline: Locator;
  readonly phoneLink: Locator;
  readonly websiteLink: Locator;
  readonly contactButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.locator('app-brand-hero-banner');
    this.name = this.header.getByRole('heading', { level: 1 });
    this.tagline = this.header.locator('.brand-info-container > p').first();
    // Scoped to the header: some companies repeat their number further down the page
    this.phoneLink = this.header.locator('a[action="telephone"]');
    this.websiteLink = this.header.locator('a[action="company-website"]');
    this.contactButton = this.header.locator('button.contact-button');
  }

  async goto(path: string) {
    await this.page.goto(path);
  }

  /** NBS's own footer also has social links, but without action="social-media". */
  socialLink(platform: string): Locator {
    return this.page.locator(`a[action="social-media"][title="Visit ${platform}"]`);
  }
}
