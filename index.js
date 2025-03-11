import puppeteer from 'puppeteer';
const iftttWebhook='' // add ur webhook url from IFTTT

async function fetchButtonTexts(url) {
    try {
        console.log(`\n🚀 Fetching button texts from: ${url} at ${new Date().toLocaleTimeString()}`);

        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: 'networkidle2' });

        // Extract button text content
        const buttonTexts = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('button'))
                .map(button => button.innerText.trim())
                .filter(text => text.length > 0); // Remove empty buttons
        });

        console.log(`📌 Extracted Button Texts:`);
        console.log(buttonTexts);

        // Count occurrences of 'BUY TICKETS' (case insensitive)
        const searchText = 'BUY TICKETS';
        const count = buttonTexts.filter(text => text.toUpperCase() === searchText).length;

        console.log(`🔍 Count of "${searchText}": ${count}`);
        if (count > 1) {
            console.log('🚨 BUY TICKETS found more than once. Sending alert via IFTTT...');
            await fetch(iftttWebhook);
        }

        await browser.close();
    } catch (error) {
        console.error('❌ Error fetching button texts:', error.message);
    }
}

// ✅ Replace with your target website
const websiteURL = 'https://shop.royalchallengers.com/ticket';

// Run the function every 30 seconds
console.log('⏳ Monitoring button texts every 30 seconds...');
fetchButtonTexts(websiteURL); // Run immediately once

setInterval(() => {
    fetchButtonTexts(websiteURL);
}, 30000); // 30 seconds (30000 ms)
