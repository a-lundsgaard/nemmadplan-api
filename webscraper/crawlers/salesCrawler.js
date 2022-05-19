const puppeteer = require('puppeteer');
const path = require('path')

//const tilbudsugen = require('../pageFunctions/sales/tilbudsugen');
//const t = require('../libraries/jQuery')


const jQueryPath = path.resolve('webscraper/libraries/jQuery.js');
const customLibraryPath = path.resolve('webscraper/libraries/scrapingLibrary.js');


//const jQueryPath = path.resolve('../libraries/jQuery.js');
//let jQueryPathIndex = path.resolve('./libraries/jQuery.js'); // for index.js

//const customLibraryPath = path.resolve('../libraries/scrapingLibrary.js');
//const customLibraryPathIndex = path.resolve('./libraries/scrapingLibrary.js'); // for index.js


async function runSalesCrawler (pageFunction, preferences) {


  const { products, chains } = preferences;
  const urls = products.map(name => 'https://www.tilbudsugen.dk/tilbud/' + name )

  console.log('Starting crawler...');
  try {
    console.log('Launching pupeteer...')
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"]
    });
    const page = await browser.newPage();

    console.log(urls)

    let results = [];

    for (let url of urls) {
      console.log('Entering url: ' + url);
      await page.goto(url, {timeout: 30000});
      console.log('Injecting scripts...');
      await page.addScriptTag({path: jQueryPath})
      await page.addScriptTag({path: customLibraryPath});

      const waitFor = '.mx-0';
      console.log('Waiting for selector: "' + waitFor + '"...');

      try {
        await page.waitForSelector(waitFor, {timeout: 10000});
      }
      catch (e) {
        console.log(results)
        await browser.close();
        return results
      }

      // runs custom javascript as if we were in the console
      console.log('Running page function...')
      const scrapedData = await page.evaluate(pageFunction);
      results.push(...scrapedData);
    }


    await browser.close();
    console.log('Finishing webscraper...');

    if (chains) {
      console.log(chains)
      if(chains.wanted) results = results.filter(item => chains.chainNames.includes(item.chain.toLowerCase()) )
      if(!chains.wanted) results = results.filter(item => !chains.chainNames.includes(item.chain.toLowerCase()) )
    }

    console.log(results)
    console.log(`Found ${results.length} results`);
    return results;

  } catch (e) {
    console.log(e)
    throw e
  }
}

/*const preferences = {
  products: ['razer'],
  chains: {
    wanted: false,
    chainNames: ['løvbjerg']
  }
};*/

//runSalesCrawler(tilbudsugen, preferences).then(res => res).catch(console.error);

module.exports = runSalesCrawler;