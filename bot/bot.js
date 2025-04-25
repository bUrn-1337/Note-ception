require('dotenv').config();
const puppeteer = require('puppeteer');
const BASE_URL = process.env.BASE_URL || 'http://0.0.0.0:3000';
const FLAG = process.env.FLAG || 'test{flag}';
const sleep = ms => new Promise(res => setTimeout(res, ms));
console.log(process.env.BASE_URL);
const CONFIG = {
    APPNAME: process.env['APPNAME'] || "Admin",
    APPURL: process.env['BASE_URL'] || "http://127.0.0.1:8000",
    APPURLREGEX: process.env['APPURLREGEX'] || "^.*$",
    APPFLAG: process.env['FLAG'] || "xss{fake_flag}",
    APPLIMITTIME: Number(process.env['APPLIMITTIME'] || "60"),
    APPLIMIT: Number(process.env['APPLIMIT'] || "5"),
};

console.table(CONFIG);

const initBrowser = async () => {
    return await puppeteer.launch({
        executablePath: "/usr/bin/chromium-browser",
        headless: true,
        args: [
            '--disable-dev-shm-usage',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-gpu',
            '--no-gpu',
            '--disable-default-apps',
            '--disable-translate',
            '--disable-device-discovery-notifications',
            '--disable-software-rasterizer',
            '--disable-xss-auditor'
        ],
        ignoreHTTPSErrors: false
    });
};

console.log("Bot started...");

module.exports = {
    name: CONFIG.APPNAME,
    urlRegex: CONFIG.APPURLREGEX,
    rateLimit: {
        windowS: CONFIG.APPLIMITTIME,
        max: CONFIG.APPLIMIT
    },
    bot: async (urlToVisit) => {
        const browser = await initBrowser();
        try {
            const page = await browser.newPage();

            page.on('console', msg => console.log('Browser Console:', msg.text()));


            const target = new URL(urlToVisit);
            await page.setCookie({
                name: 'flag',
                value: FLAG,
                domain: target.hostname,  
                path: '/',               
                httpOnly: false,
                secure: false
            });

           
            console.log(`Bot visiting ${urlToVisit}`);
            await page.goto(urlToVisit, {
                timeout: 3000,
                waitUntil: 'domcontentloaded'
            });

            console.log("Bot visited successfully!");

            await sleep(20000); 

            console.log("Closing browser...");
            await page.close();
            await browser.close();
            return true;
        } catch (e) {
            console.error(e);
            await browser.close();
            return false;
        }
    }
};
