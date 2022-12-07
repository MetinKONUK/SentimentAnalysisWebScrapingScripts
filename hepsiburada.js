import puppeteer from "puppeteer";

// list of all products' product code
const products = [
    // {code: 'crystalin-animal-health-1-lt-yara-bakim-solusyonu-ve-dezenfektan-pm-HB00000EN9C4'},
    {code: 'crystalin-kedi-kopek-icin-deri-ve-meme-bakim-solusyonu-200-ml-p-HBV00000CF6KA'},
];


// scraper function
const Scrape = async (code) => {
    const browser = await puppeteer.launch({headless: true});
    const page = (await browser.pages())[0];
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
    await page.goto(`https://hepsiburada.com/${code}-yorumlari?sayfa=1`);

    // scrape total reviews page count
    await page.waitForSelector('.hermes-FiltersContainerMobile-module-oTmQCnHCBC1J5T7ihRtB', {visible: true});
    const pageCount = await page.evaluate(() => {
        return Math.ceil((document.querySelector('.hermes-FiltersContainerMobile-module-oTmQCnHCBC1J5T7ihRtB')
            .textContent.split(' ')[4]) / 10);
    });

    // scrape product name
    await page.waitForSelector('.hermes-ProductRate-module-cHmp3strss2sSkhaeXS3 > span', {visible: true});
    const productName = await page.evaluate(() => {
        return document.querySelector('.hermes-ProductRate-module-cHmp3strss2sSkhaeXS3 > span').textContent.trim();
    });
    let comments = [];
    for(let i = 1; i < pageCount; ++i){
        console.log('Scraping page: ', i);
        await page.waitForSelector('[itemprop=review]', {visible: true});
            const partialComments = await page.evaluate(() => {
                let comments = [];
                const reviews = document.querySelectorAll('[itemprop=review]');
                reviews.forEach((review) => {
                    let content = review.querySelector('[itemprop=description]').textContent.trim();
                    let date = review.querySelector('[itemprop=datePublished]').getAttribute('content').trim();
                    let authorData = review.querySelectorAll('.hermes-ReviewCard-module-p2lw9pDiloK0sQ9iHHQy > span');
                    let authorName = authorData[0].textContent.trim();
                    let authorAge = Number(authorData[1].textContent.trim().slice(1, -1));
                    let authorCity = authorData[2].textContent.trim();
                    let rate = review.querySelectorAll('.hermes-RatingPointer-module-UefD0t2XvgGWsKdLkNoX > div').length;
                    comments.push({content, date, authorName, authorAge, authorCity, rate});
                });
                return comments;
            });
        comments = comments.concat(partialComments);
        await page.goto(`https://hepsiburada.com/${code}-yorumlari?sayfa=${i+1}`);
    }

    await browser.close();
    return {productName, comments};
}

// scrape all products' comments
products.forEach((product) => {
    Scrape(product.code)
        .then(data => {
            const {productName, comments} = data;
            console.log('Product Name:', productName);
            console.log('Review Count', comments.length);
            comments.forEach((comment) => {
                let {content, date, authorName, authorAge, authorCity, rate} = comment;
                console.log(`Author Name: ${authorName}\nAuthor Age: ${authorAge}\nAuthor City: ${authorCity}\nDate: ${date}\nContent: ${content}\nRate: ${rate}\n`);
            });
        })
        .catch((err) => {
            console.log(err)
        });
})
