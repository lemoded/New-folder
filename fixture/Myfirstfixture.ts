import {test as baseTest,Page} from '@playwright/test';
import { checkBoxPage } from "../pages/CheckBoxPage";

type myfirstFixture = {
   CheckBoxPage : checkBoxPage;
}

export const test = baseTest.extend<myfirstFixture>({
    CheckBoxPage : async( {page} , use ) => {
        const box = new checkBoxPage(page);
        await use(box);

    }   
});