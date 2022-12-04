import puppeteer from "puppeteer";

// crystalin-animal-health-1-lt-yara-bakim-solusyonu-ve-dezenfektan-pm-HB00000EN9C4
// crystalin-kedi-kopek-icin-deri-ve-meme-bakim-solusyonu-200-ml-p-HBV00000CF6KA
const scrapeComments = async (productCode) => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto(`https://hepsiburada.com/${productCode}-yorumlari`);
    await page.waitForSelector('.hermes-FiltersContainerMobile-module-oTmQCnHCBC1J5T7ihRtB');
    const pageCount = await page.evaluate(() => {
        return document.querySelector('.hermes-FiltersContainerMobile-module-oTmQCnHCBC1J5T7ihRtB')
                       .textContent.split(' ')[4];
    });
    console.log('Total Page Count: ', Math.ceil(pageCount / 10));
    await page.waitForSelector('[itemprop=review]', {visible: true});
    const data = await page.evaluate(() => {
        let result = [];
        const reviews = document.querySelectorAll('[itemprop=review]');
        reviews.forEach((review) => {
            let content = review.querySelector('[itemprop=description]').textContent.trim();
            let date = review.querySelector('[itemprop=datePublished]').getAttribute('content').trim();
            let authorName = review.querySelectorAll('.hermes-ReviewCard-module-p2lw9pDiloK0sQ9iHHQy > span')[0].textContent.trim();
            let authorAge = review.querySelectorAll('.hermes-ReviewCard-module-p2lw9pDiloK0sQ9iHHQy > span')[1].textContent.trim();
            let authorCity = review.querySelectorAll('.hermes-ReviewCard-module-p2lw9pDiloK0sQ9iHHQy > span')[2].textContent.trim();
            let rate = review.querySelectorAll('.hermes-RatingPointer-module-UefD0t2XvgGWsKdLkNoX > div').length;
            result.push({content, date, authorName, authorAge, authorCity, rate});
        });
        return result;
    });
    await browser.close();
    return data;
}

// const productCode = 'crystalin-animal-health-1-lt-yara-bakim-solusyonu-ve-dezenfektan-pm-HB00000EN9C4';
const productCode = 'crystalin-kedi-kopek-icin-deri-ve-meme-bakim-solusyonu-200-ml-p-HBV00000CF6KA';
scrapeComments(productCode)
    .then((reviews) => {
        console.log('Review Count: ', reviews.length);
        reviews.forEach((review) => {
        let {content, date, authorName, authorCity, rate} = review;
            console.log(`Content: ${content}\nDate: ${date}\nAuthor Name: ${authorName}\nAuthor City: ${authorCity}\nRate: ${rate}`);
        });
    })
    .catch((err) => {
        console.log(err)
    });
