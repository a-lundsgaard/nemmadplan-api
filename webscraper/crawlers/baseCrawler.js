const puppeteer = require('puppeteer');
const path = require('path')

//const t = require('../gsheet/credentials.json')

const readGoogleSheet = require('../gsheet');
const { checkIngredient } = require('../helpers/helpers.js');

const jQueryPath = path.resolve('webscraper/libraries/jQuery.js');
//let jQueryPathIndex = path.resolve('./libraries/jQuery.js'); // for index.js

const customLibraryPath = path.resolve('webscraper/libraries/scrapingLibrary.js');
//const customLibraryPathIndex = path.resolve('./libraries/scrapingLibrary.js'); // for index.js


async function runCrawler (url, pageFunction, waitFor) {

  console.log('Starting crawl...')
  try {
    console.log('Launching pupeteer...')
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"]
    });
    const page = await browser.newPage();

    console.log('Entering url: ' + url);
    await page.goto(url, {timeout: 30000});
    console.log('Injecting scripts...');
    await page.addScriptTag({path: jQueryPath})
    await page.addScriptTag({path: customLibraryPath});

    if (waitFor) {
      Number(waitFor) ?
        await page.waitForTimeout(waitFor) :
        await page.waitForSelector(waitFor, {timeout: 1000});
    }

    // runs custom javascript as if we were in the console
    console.log('Running page function...')
    const scrapedData = await page.evaluate(pageFunction);

    console.log('Found result:' +scrapedData)
    await browser.close();

    console.log('Reading google sheets containing all known units:')
    const unitsArray = await readGoogleSheet();

    console.log('Finishing webscraper...');

    return {
      ...scrapedData,
      ingredients: await Promise.all(scrapedData.ingredients.map(obj => checkIngredient(obj, unitsArray) ))
    }

  } catch (e) {
    console.log(e)
    throw e
  }
}

module.exports = runCrawler;
//runCrawler("https://www.arla.dk/opskrifter/boller-i-karry/").then(console.log).catch(console.error);