import { TextfieldLocators } from "../locator/TextfieldLocators"
import { Page } from "@playwright/test";


export class TestFieldPage
{
   private page : Page

   constructor(page : Page)
   {
    this.page = page;
   }

    async login(username : string , password : string, email : string)
    {
        await this.page.locator(TextfieldLocators.email).waitFor({ state: 'visible' });
        await this.page.locator(TextfieldLocators.name).waitFor({ state: 'visible' });
        await this.page.locator(TextfieldLocators.password).waitFor({ state: 'visible' });
        await this.page.locator(TextfieldLocators.register).waitFor({state :'visible'});

        await this.page.locator(TextfieldLocators.email).fill(email);
        await this.page.locator(TextfieldLocators.name).fill(username);
        await this.page.locator(TextfieldLocators.password).fill(password);
        await this.page.locator(TextfieldLocators.password).click();
    }

    


} 

