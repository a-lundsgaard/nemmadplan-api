const puppeteer = require('puppeteer');
const path = require('path');

const nemlig = require('../pageFunctions/shoppingList/nemlig.com')

//const tilbudsugen = require('../pageFunctions/sales/tilbudsugen');
//const t = require('../libraries/jQuery')


//const jQueryPath = path.resolve('webscraper/libraries/jQuery.js');
//const customLibraryPath = path.resolve('webscraper/libraries/scrapingLibrary.js');


const jQueryPath = path.resolve('../libraries/jQuery.js');
//let jQueryPathIndex = path.resolve('./libraries/jQuery.js'); // for index.js

const customLibraryPath = path.resolve('../libraries/scrapingLibrary.js');
//const customLibraryPathIndex = path.resolve('./libraries/scrapingLibrary.js'); // for index.js


async function runShoppingListCrawler (pageFunction, preferences) {


  const { products, chains } = preferences;
  const urls = products.map(name => 'https://www.nemlig.com/?search=' + name )

  console.log('Starting crawler...');
  try {
    console.log('Launching pupeteer...')
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--no-sandbox"],
      ignoreDefaultArgs: ["--enable-automation"]

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

      const waitFor = '.productlist-item__link';
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
      const scrapedData = await page.evaluate(async function nemlig() {

  
        const productId = $('.productlist-item__link').eq(0).attr('href').split('-').pop()

       /* return fetch("https://www.nemlig.com/webapi/basket/PlusOneToBasket", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({productId: "5015695", quantity: 1}),
        }).then(res => res.json()).then(res=> res)*/

        //return 'hej'
    
    
        const body = {productId: productId, quantity: 1};

    
        try {
            const data = await fetch("https://www.nemlig.com/webapi/basket/PlusOneToBasket", {
                method:'post',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body),
            })
    
            const jsonData = await data.json();
          console.log(jsonData);
          location.reload()
            return jsonData;
            
        } catch (error) {
            throw error
        }
    
    
      /*
      .then(res => res.json())
        .catch(e => console.log(e))
        .then(json => console.log(json))
        .catch(e => console.log(e))*/
    
      });

      console.log(scrapedData)
     // results.push(...scrapedData);
    }


    //await browser.close();
    console.log('Finishing webscraper...');

  /*  if (chains) {
      console.log(chains)
      if(chains.wanted) results = results.filter(item => chains.chainNames.includes(item.chain.toLowerCase()) )
      if(!chains.wanted) results = results.filter(item => !chains.chainNames.includes(item.chain.toLowerCase()) )
    }*/

    console.log(results)
    //console.log(`Found ${results.length} results`);
   // return results;

  } catch (e) {
    console.log(e)
    throw e
  }
}

const preferences = {
  products: ['leverpostej', 'smør', 'skyr'],
  chains: {
    wanted: false,
    chainNames: ['løvbjerg']
  }
};

runShoppingListCrawler(nemlig, preferences).then(res => res).catch(console.error);

//module.exports = runSalesCrawler;