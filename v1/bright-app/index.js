import puppeteer from 'puppeteer-core' // by google


async function main() {
    let browser;
    try {
      //using bright-data superproxy so we can use the same browser for multiple requests
      // it alters the user agent and ip address for each request
      const endpoint = 'wss://brd-customer-hl_21964b0e-zone-scraping_browser1:vc45h6awlkbn@brd.superproxy.io:9222';
      browser = await puppeteer.connect({
        browserWSEndpoint: endpoint
      });

      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(2*60*1000);
      await page.goto('https://amazon.com');
      const body = await page.$('body');

      const html = await page.evaluate(() => document.documentElement.outerHTML);
      console.log('-->', html);


    } catch(e) {
      console.log('Error while scraping:', e);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

main();