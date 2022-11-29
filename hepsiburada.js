import puppeteer from "puppeteer";

// crystalin-animal-health-1-lt-yara-bakim-solusyonu-ve-dezenfektan-pm-HB00000EN9C4
const scrapeComments = async (productCode) => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto(`https://hepsiburada.com/${productCode}-yorumlari`);
    await page.waitForSelector('[itemprop=review]', {visible: true});
    const data = await page.evaluate(() => {
        let result = [];
        const reviews = document.querySelectorAll('[itemprop=review]');
        reviews.forEach((review) => {
            let content = review.querySelector('[itemprop=description]').textContent.trim();
            result.push({content});
        });
        return result;
    });
    await browser.close();
    return data;
}

const productCode = 'crystalin-animal-health-1-lt-yara-bakim-solusyonu-ve-dezenfektan-pm-HB00000EN9C4';
scrapeComments(productCode)
    .then((reviews) => {
        console.log('Review Count: ', reviews.length);
        reviews.forEach((review) => {
            console.log(`Content: ${review.content}`);
        });
    })
    .catch((err) => {
        console.log(err)
    });
