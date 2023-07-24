const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

async function run() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.crunchyroll.com/news/latest');

    const html = await page.content();
    const $ = cheerio.load(html);
    const newsElements = $('article.articleListingCard-module_articleAsideCard_PODawwvV37dodOs3K8e_');

    const newsList = [];

    newsElements.each((index, element) => {
        const title = $('a.articleListingCard-module_title_Fq6qkYUCiaf8X4utWKl1 > h3', element).text();
        const summary = $('p.articleListingCard-module_summary_nUbIPd5oF33nKaBOPK0v', element).text();
        const imageLink = $('div.articleListingCard-module_thumbnail_D4w1I0i9W6ZKbWA1omOT > a > picture > img', element).attr('src');
        const newsLink = $('a.articleListingCard-module_title_Fq6qkYUCiaf8X4utWKl1', element).attr('href');
        const date = $('div.articleListingCard-module_date_BH09Lart7eEoidCp9wg6', element).text();
        const author = $('div.articleCardAuthorRow-module_author_kkfwwNhZtNKQpyVxNi57 > a', element).text();

        newsList.push({
            title,
            summary,
            imageLink,
            newsLink: `https://www.crunchyroll.com${newsLink}`,
            date,
            author
        });
    });

    await browser.close();

    console.log(newsList);
}

run();
