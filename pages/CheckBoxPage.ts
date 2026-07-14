import { checkBoxLocator } from "../locator/checkBoxLocatox";
import {Page} from "@playwright/test"

export class checkBoxPage {
  constructor(private page: Page) {}

  async clickOnCheckBox(name: string) {
    //await this.page.locator(checkBoxLocator.checkBox(name)).waitFor({state : 'visible'});
    await this.page.locator(checkBoxLocator.checkBox(name)).check();
  }
}
