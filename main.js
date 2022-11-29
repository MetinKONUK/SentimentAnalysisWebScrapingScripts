/*
const puppeteer = require();
asin = B07DGPHVSH
const scrapeComments = async (asin) => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto(`https://www.amazon.com.tr/product-reviews/${asin}`);
    await page.waitForSelector('[data-hook=review]', { visible: true});
    const data = await page.evaluate(() => {
        let result = [];
        const reviews = document.querySelectorAll('[data-hook=review]');
        reviews.forEach((review) => {
            let date = review.querySelector('[data-hook=review-date]');
            let rate = Number(review.querySelector('[data-hook=review-star-rating]').textContent.slice(-3)[0]);
            result.push({date, rate});
        });
        return result;
    });
    return data;
}

scrapeComments('B07DGPHVSH')
    .then((comments) => {
        comments.forEach(comment => {
            console.log(`Date: ${comment.date}\nRate: ${comment.rate}`);
        });
    })
    .catch((err) => {
    console.log(err)
});
*/
