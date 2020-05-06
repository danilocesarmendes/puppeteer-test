const puppeteer = require('puppeteer');
const fs = require("fs");
const request = require("request-promise-native");
 
(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  await page.goto('http://www.tcinternet.coderp.com.br/xgdpr/servlet/xgd4000m');

  await delay(4000);

  // download do pdf
  let pathFilePDF = "D:\\ambiente\\node\\puppeteer-test\\projetos_aprovados_052020.pdf";
  let urlPDF = "http://www.tcinternet.coderp.com.br/xgdpr/XGD/ProjetosAprovados_052020.pdf";
  downloadPDF(urlPDF, pathFilePDF);

  await delay(60000);

  await browser.close();

})();

async function downloadPDF(pdfURL, outputFilename) {
  let pdfBuffer = await request.get({uri: pdfURL, encoding: null});
  console.log("Writing downloaded PDF file to " + outputFilename + "...");
  fs.writeFileSync(outputFilename, pdfBuffer);
}



function delay(time) {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}