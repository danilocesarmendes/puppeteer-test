/**
 * Importa a lib do anticaptcha assincrona
 * https://www.npmjs.com/package/anticaptcha-async
 */
const anticaptcha = require('anticaptcha-async')
const puppeteer = require('puppeteer');
const fs = require("fs");
 
(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  await page.goto('https://servicos.receita.fazenda.gov.br/Servicos/ConsRest/Atual.app/paginas/index.asp');

  //cpf
	await page.waitForSelector("[name='CPF']");
  await page.type("[name='CPF']", '99999999999');

  await delay(2000);
  
  //data_nascimento
  await page.keyboard.down("Tab");  
  await page.type("[name='data_nascimento']", '01011999');

  // salvando a imagem do captcha utilizando o Puppeter
  await screenshotDOMElement(page, '#imgCaptcha', 16);

  // Cria o client
   const client = await anticaptcha("SEU_TOKEN_AQUI")

  const captchaFileName = 'D:\\ambiente\\node\\puppeteer-test\\element.png'

  const captcha = await client.getImage(fs.createReadStream(captchaFileName), {
    restriction: {
      minLength: 5,
      maxLength: 5,
    },
  });

  console.log(captcha.getValue());

  // informando o valor do captcha
  await page.type("[name='txtTexto_captcha_serpro_gov_br']", captcha.getValue());

  // await page.keyboard.down("Enter"); 
  const form = await page.$('#Submit1');
  await form.click();
  
  await delay(5000);

  //console.log(await page.content());
  await delay(60000);

  await browser.close();

})();

async function screenshotDOMElement(page, selector, padding = 0) {
  const rect = await page.evaluate(selector => {
    const element = document.querySelector(selector);
    const {x, y, width, height} = element.getBoundingClientRect();
    return {left: x, top: y, width, height, id: element.id};
  }, selector);

  return await page.screenshot({
    path: 'element.png',
    clip: {
      x: rect.left - padding,
      y: rect.top - padding,
      width: rect.width + padding * 2,
      height: rect.height + padding * 2
    }
  });
}


function delay(time) {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}