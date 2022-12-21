import { MongoClient } from 'mongodb';
import moment from 'moment';
import * as schedule from 'node-schedule';

import { Scrape as trendyolScraper } from './trendyolScraper.js';
import { products as trendyolProductsList } from "./trendyolProductsList.js";

import { Scrape as hepsiburadaScraper } from "./hepsiburadaScraper.js";
import { products as hepsiburadaProductsList } from "./hepsiburadaProductsList.js";

import { Scrape as amazonScraper } from './amazonScraper.js';
import { products as amazonProductsList } from "./amazonProductsList.js";

// CONFIGURE MOMENT TO CALCULATE DATE BASED ON LOCAL TIME
moment.locale();

// LIST OF ALL PRODUCT CATEGORIES
let categories = ['animal-health-200-ml', 'animal-health-50-ml', 'antiseptic-sanitizer-100-ml', 'animal-health-1000-ml']

// CREDENTIALS
const USERNAME = 'crystalin';
const PASSWORD = 'crystalin';
// CONNECTION URI
const URI = `mongodb+srv://${USERNAME}:${PASSWORD}@crystalin.w93y0ww.mongodb.net/?retryWrites=true&w=majority`;
// CREATE A NEW MongoClient
const client = new MongoClient(URI);

const run = async () => {
    try
    {
        // CONNECT THE CLIENT TO THE MONGODB SERVER
        await client.connect();
        // ESTABLISH & VERIFY CONNECTION
        await client.db('admin').command({ ping: 1});
        console.log('CONNECTED TO THE DATABASE');
        const collection = await client.db('crystalin').collection('scraped-data-collection');
        // INITIALIZE NEW OBJECTS FOR NEW SCRAPE DATES INSIDE ALL PRODUCT TYPES
        const date =  moment().format('L');
        for(const category of categories) {
            if(await collection.findOne({productName: category}) === null){
                await collection.insertOne({productName: category});
            }

            if( await collection.findOne({productName:category, 'comments.scrapeDate':date}) === null){
                    await collection.updateOne({productName:category}, {$push: {comments: {isAnalyzed: false, scrapeDate: date, trendyol: [], hepsiburada: [], amazon: []}}});
            }
        }
        // SCRAPE AMAZON COMMENTS & SAVE TO THE DATABASE
        for(const {asin, category} of amazonProductsList) {
            await amazonScraper(asin)
                .then(({productName, comments}) => {
                    collection.updateOne({productName: category, 'comments.scrapeDate': date}, {$push: {'comments.$.amazon': {$each: comments}}});
                    console.log('amazon updated');
                })
                .catch((err) => {
                    // error ready here
                });
        }
        // SCRAPE TRENDYOL COMMENTS & SAVE TO THE DATABASE
        for(const {code, category} of trendyolProductsList) {
            await trendyolScraper(code)
                .then(({productName, comments}) => {
                    collection.updateOne({productName: category, 'comments.scrapeDate': date}, {$push: {'comments.$.trendyol': {$each: comments}}});
                    console.log('trendyol updated');
                })
                .catch((err) => {
                    // error ready here
                    console.log(err);
                });
        }
        // SCRAPE HEPSIBURADA COMMENTS & SAVE TO THE DATABASE
        for(const {code, category} of hepsiburadaProductsList){
            await hepsiburadaScraper(code)
                .then(({productName, comments}) => {
                    collection.updateOne({productName: category, 'comments.scrapeDate': date}, {$push: {'comments.$.hepsiburada': {$each: comments}}});
                    console.log('hepsiburada updated');
                })
                .catch((err) => {
                    // error ready here
                })
        }
    }
    catch(err)
    {
        console.log(err);
    }
}

// RUN PROGRAMME EVERY MIDNIGHT
schedule.scheduleJob('10 * * * *', () => {
    run().then(() => {
        console.log('Scraping Done!')
    });
});
