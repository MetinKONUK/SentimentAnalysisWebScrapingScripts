import puppeteer from 'puppeteer';
import moment from 'moment';

// scraper function
const Scrape = async (asin) => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
    await page.goto(`https://www.amazon.com.tr/product-reviews/${asin}`);
    await page.waitForSelector('[data-hook=review]', { visible: true});
    const data = await page.evaluate(() => {
        let productName = document.querySelector('[data-hook=product-link]').textContent.trim();
        let comments = [];
        const reviews = document.querySelectorAll('[data-hook=review]');
        reviews.forEach((review) => {
            let date = review.querySelector('[data-hook=review-date]').textContent;
            let rate = Number(review.querySelector('[data-hook=review-star-rating]').textContent.slice(-3)[0]);
            let content = review.querySelector('[data-hook=review-body]').textContent.trim();
            let authorName = review.querySelector('.a-profile-name').textContent;
            let reviewTitle = review.querySelector('[data-hook=review-title]').textContent.trim();
            comments.push({date, rate, content, authorName, reviewTitle});
        });
        return {productName, comments};
    });
    await browser.close();
    return data;
};

export { Scrape };
