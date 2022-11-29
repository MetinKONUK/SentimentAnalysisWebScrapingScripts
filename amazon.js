import puppeteer from "puppeteer";

class Scrape {
    constructor(products) {
        this.products = products;
    }
    scrapeComments = async (asin) => {
        const browser = await puppeteer.launch({headless: true});
        const page = await browser.newPage();

        await page.goto(`https://www.amazon.com.tr/product-reviews/${asin}`);
        await page.waitForSelector('[data-hook=review]', { visible: true});
        const data = await page.evaluate(() => {
            let result = [];
            const reviews = document.querySelectorAll('[data-hook=review]');
            reviews.forEach((review) => {
                let date = review.querySelector('[data-hook=review-date]').textContent;
                let rate = Number(review.querySelector('[data-hook=review-star-rating]').textContent.slice(-3)[0]);
                let content = review.querySelector('[data-hook=review-body]').textContent.trim();
                let authorName = review.querySelector('.a-profile-name').textContent;
                let reviewTitle = review.querySelector('[data-hook=review-title]').textContent.trim();
                result.push({date, rate, content, authorName, reviewTitle});
            });
            return result;
        });
        await browser.close();
        return data;
    }
}

const products = [{asin: 'B07DGPHVSH'}, {asin: 'B00IHJTG56'}, {asin: 'B09XKLR3ML'}, {asin: 'B09BZFZCF7'}];
let scrape = new Scrape(products);
scrape.products.forEach((product) => {
    scrape.scrapeComments(product.asin)
        .then((comments) => {
            console.log('Review Count: ', comments.length);
            comments.forEach(comment => {
                console.log(`Date: ${comment.date}\nRate: ${comment.rate}\nReview-Title: ${comment.reviewTitle}\nContent: ${comment.content}\nAuthor-Name: ${comment.authorName}\n`);
            });
        })
        .catch((err) => {
            console.log(err);
        });
});
