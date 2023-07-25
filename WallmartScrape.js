require('dotenv').config();
const puppeteer = require('puppeteer-core');

async function run() {
    const auth = `${process.env.BRIGHTDATA_USERNAME}:${process.env.BRIGHTDATA_PASSWORD}`;

    let browser;
    try {
        browser = await puppeteer.connect({
            browserWSEndpoint: `wss://${auth}@${process.env.HOST}:${process.env.PORT}`,
        });

        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(2*60*1000);

        await page.goto('https://www.walmart.com/shop/deals/food?povid=976759_nup_deals_food_AllFood_Shopallfooddeals_Rweb_June_2');

        // Wait for the title, price and image to be rendered
        await page.waitForSelector('span[data-automation-id="product-title"]');
        await page.waitForSelector('div[data-automation-id="product-price"] > div[class^="mr1"]');
        await page.waitForSelector('img[data-testid="productTileImage"]');

        // Get the text of the product title for all products
        const productTitles = await page.$$eval('span[data-automation-id="product-title"]', titles => titles.map(title => title.textContent));

        // Get the text of the product price for all products
        const productPrices = await page.$$eval('div[data-automation-id="product-price"] > div[class^="mr1"]', prices => prices.map(price => price.textContent));

        // Get the image url of the product for all products
        const productImages = await page.$$eval('img[data-testid="productTileImage"]', images => images.map(image => image.src));

        for(let i = 0; i < productTitles.length; i++) {
            console.log('Product Title:', productTitles[i]);
            console.log('Product Price:', productPrices[i]);
            console.log('Product Image URL:', productImages[i]);
            console.log('---');
        }
    } catch(e){
        console.error('run failed', e);
    } finally {
        await browser?.close();
    }
}

if (require.main==module)
    run();
