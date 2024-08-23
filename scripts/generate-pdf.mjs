import puppeteer from 'puppeteer';
import path from 'path';
import { createServer } from 'http-server';
import { exec } from 'child_process';

(async () => {
    const serveDirectory = path.join(path.resolve(), 'public');
    const server = createServer({ root: serveDirectory });

    server.listen(9000, async () => {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            // Use the local server URL
            const url = 'http://localhost:9000';
            await page.goto(url, { waitUntil: 'networkidle2' });

            // Generate PDF
            const pdfPath = path.join(path.resolve(), 'public', 'resume.pdf');
            await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });

            await browser.close();
            console.log('PDF generated successfully!');
        } catch (err) {
            console.error('Error generating PDF:', err);
        } finally {
            server.close();
        }
    });
})();