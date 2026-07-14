import { test } from '../fixture/Myfirstfixture';
import { expect } from '@playwright/test';
import { checkBoxPage } from '../pages/CheckBoxPage';
import { checkBoxLocator } from '../locator/checkBoxLocatox';
import {getMapOfMultiRowTable} from "../util/utils"
const filePath = "C:/Users/2026/Downloads/QspidersDemoAutomation.xlsx";
const sheetName = 'Login';

test('Check On Check Box', async ({ page , CheckBoxPage}) => {
  await page.goto('https://demoapps.qspiders.com/ui/checkbox?sublist=0');
  const mapData = await getMapOfMultiRowTable({
      filePath,
      sheetName,
      uniqueData: '2',
      uniqueDataIndex: 0,
      isTableVertical: false,
    }); 
    console.log(mapData);

  await CheckBoxPage.clickOnCheckBox(mapData.checkbox1);
  await CheckBoxPage.clickOnCheckBox(mapData.checkbox2);
  await CheckBoxPage.clickOnCheckBox(mapData.checkbox3);
  expect(page.locator(checkBoxLocator.checkBox(mapData.checkbox1))).toBeChecked();
});
  