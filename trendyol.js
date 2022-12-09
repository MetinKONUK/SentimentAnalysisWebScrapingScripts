import puppeteer from 'puppeteer';

// list of all products' product code
const products = [
    { code: 'animal-health-200-ml-p-317233333'},
    { code: '200-ml-antiseptik-dezenfektan-sprey-p-22714059' },
];

// scraper function
const Scrape = async (code) => {
    const browser = await puppeteer.launch({headless: true});
    const page = (await browser.pages())[0];
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
    await page.goto(`https://www.trendyol.com/crystalin/${code}/yorumlar`);

    // scrape total comments count & product name
    await page.waitForSelector('.pr-rnr-sm-p-s > span', {visible: true});
    const {productName ,commentCount} = await page.evaluate(() => {

        let commentCount = Number(document.querySelectorAll('.pr-rnr-sm-p-s > span')[1]
            .innerHTML.split(' ')[0]);
        let productName = document.querySelector('[class=product-name]').textContent;
        return {productName, commentCount};
    });
    console.log(commentCount);
    await page.waitForSelector('[class=pr-rnr-com]', {visible: true});
    const comments = await page.evaluate(async (commentCount) => {
        let reviews = document.querySelectorAll('[class=rnr-com-w]');
        let scrollAmount = 1000;
        while(reviews.length < commentCount){
            console.log('Scrolled', scrollAmount);
            window.scrollBy(0, scrollAmount);
            await new Promise(resolve => {
                setTimeout(resolve, 1000)
            })
            if(reviews.length !== document.querySelectorAll('[class=rnr-com-w]').length){
                scrollAmount += 100;
            }
            reviews = document.querySelectorAll('[class=rnr-com-w]');
        }

        let comments = [];
        reviews.forEach(review => {
            let content = review.querySelector('p').textContent.trim();
            let rate = review.querySelectorAll('.ratings > div').length;
            let details = review.querySelector('[class=rnr-com-usr]').textContent.trim().split('|');
            let authorName = details[0];
            let date = details[1];
            let vendorName = details[2].split(' ').slice(0, -2).join(' ');
            comments.push({authorName, date, content, rate, vendorName});
        })
        return comments;
    }, commentCount);

    await browser.close();
    return {productName, comments};
}

products.forEach(product => {
    let {code} = product;
    Scrape(code).then(({productName, comments}) => {
        console.log('Product Name: ', productName);
        console.log('Total Comments Count: ', comments.length);
        comments.forEach(comment => {
            let {authorName, date, content, rate, vendorName} = comment;
            console.log(`Author Name: ${authorName}\nDate: ${date}\nContent: ${content}\nRate: ${rate}\nVendor Name: ${vendorName}\n`);
        });
    }).catch(err => {
        console.log(err)
    });
})
