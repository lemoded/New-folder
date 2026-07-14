export const checkBoxLocator = {
  Email: "//span[text() ='Email']/preceding-sibling::input",
  whatsapp: "//span[text() ='WhatsApp']/preceding-sibling::input",
  Message: "//span[text() ='Message']/preceding-sibling::input",
  CheckoutPage: "//h1[contains(@class,text-orange)]",

  checkBox(label: string): string {
      console.log(`//span[text() ='${label}']/preceding-sibling::input`);
    return `//span[text() ='${label}']/preceding-sibling::input`;
  }
};