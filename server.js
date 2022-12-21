import { MongoClient } from 'mongodb';
import moment from 'moment';
import * as fs from 'fs';

import { Scrape as trendyolScraper } from './trendyolScraper.js';
import { products as trendyolProductsList } from "./trendyolProductsList.js";

import { Scrape as hepsiburadaScraper } from "./hepsiburadaScraper.js";
import { products as hepsiburadaProductsList } from "./hepsiburadaProductsList.js";

import { Scrape as amazonScraper } from './amazonScraper.js';
import { products as amazonProductsList } from "./amazonProductsList.js";

trendyolProductsList.forEach(({ code }) => {
    trendyolScraper(code)
        .then(({productName, comments}) => {
            console.log('Trendyol Scraped!')
            // data ready here
        })
        .catch((err) => {
            // error ready here
        });
});

// amazonProductsList.forEach(({asin} ) => {
//     amazonScraper(asin)
//         .then(({productName, comments}) => {
//             console.log('Amazon Scraped!')
//             // data ready here
//         })
//         .catch((err) => {
//             // error ready here
//         });
// });

// hepsiburadaProductsList.forEach(({ code }) => {
//     hepsiburadaScraper(code)
//         .then(({productName, comments}) => {
//             console.log('HepsiBurada Scraped!')
//             // data ready here
//         })
//         .catch((err) => {
//             // error ready here
//         })
// })

//
// const USERNAME = 'crystalin';
// const PASSWORD = 'crystalin';
// // CONNECTION URI
// const URI = `mongodb+srv://${USERNAME}:${PASSWORD}@crystalin.w93y0ww.mongodb.net/?retryWrites=true&w=majority`;
//
// // CREATE A NEW MongoClient
// const client = new MongoClient(URI);
//
// const run = async () => {
//     try
//     {
//         // CONNECT THE CLIENT TO THE MONGODB SERVER
//         await client.connect();
//         // ESTABLISH & VERIFY CONNECTION
//         await client.db('admin').command({ ping: 1});
//         console.log('CONNECTED TO THE DATABASE');
//
//         const employees = await client.db('crystalin').collection('employee-collection').find({}).toArray();
//         console.log(employees);
//     }
//     catch(err)
//     {
//         console.log(err);
//     }
//     finally
//     {
//         // ENSURE THAT CLIENT IS CLOSED WHEN PROGRAM ENDS
//         await client.close();
//     }
// }
//
// run().then();
