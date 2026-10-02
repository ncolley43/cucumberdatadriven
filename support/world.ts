import { IWorldOptions, setWorldConstructor, World } from '@cucumber/cucumber';
import { BrowserContext, Page } from '@playwright/test';
import { ManufacturerPage } from '../pages/ManufacturerPage';
import { Company } from '../test-data/companies';

export interface WorldParameters {
  /** Run the browser with a visible window (npm run test:head) */
  headed?: boolean;
}

/** State shared between the steps of one scenario. */
export class CustomWorld extends World<WorldParameters> {
  context!: BrowserContext;
  page!: Page;
  overviewPage!: ManufacturerPage;
  /** Expected page content, loaded from test-data by the "Given" step */
  company!: Company;

  constructor(options: IWorldOptions<WorldParameters>) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);
