import puppeteer from "puppeteer";

// list of all products' asin codes
const products = [{asin: 'B07DGPHVSH'}, {asin: 'B00IHJTG56'}, {asin: 'B09XKLR3ML'}, {asin: 'B09BZFZCF7'}];

// scraping function
const Scrape = async (asin) => {
    const browser = await puppeteer.launch({headless: true});
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
}

// scrape all products' comments
products.forEach((product) => {
    Scrape(product.asin)
        .then(data => {
            const { productName, comments } = data;
            console.log('Product Name: ', productName)
            console.log('Review Count: ', comments.length);
            comments.forEach((review) => {
                let {date, rate, content, authorName, reviewTitle} = review;
                console.log(`Author Name: ${authorName}\nDate: ${date}\nReview Title: ${reviewTitle}\nContent: ${content}\nRate: ${rate}\n`)
            });
        });
});
