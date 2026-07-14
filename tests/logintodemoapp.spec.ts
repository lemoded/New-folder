// @ts-check
import { expect, test } from "@playwright/test";
import { getMapOfMultiRowTable } from '../util/utils';
import { TestFieldPage } from "../pages/TestFieldPage";
import { TextfieldLocators } from "../locator/TextfieldLocators";

const filePath = "C:/Users/2026/Downloads/QspidersDemoAutomation.xlsx";
const sheetName = 'Login';

test('Login with valid user name and password', async ({ page }) => {
  await page.goto('https://demoapps.qspiders.com/ui?scenario=1');

  const mapData = await getMapOfMultiRowTable({
    filePath,
    sheetName,
    uniqueData: '1',
    uniqueDataIndex: 0,
    isTableVertical: false,
  });

  console.log(mapData);

  const loginpage = new TestFieldPage(page);
  await loginpage.login(mapData.username, mapData.password, mapData.email);
  expect(page.locator(TextfieldLocators.toster).isVisible);
});