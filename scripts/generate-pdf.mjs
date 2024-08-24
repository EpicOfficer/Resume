import puppeteer from 'puppeteer';
import { createServer } from 'http-server';
import path from "node:path";

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
            const pdfPath = path.join(path.resolve(), 'public', 'export.pdf');
            await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });

            await browser.close();
            process.stdout.write('PDF generated successfully!\n');
        } catch (err) {
            process.stdout.write('Error generating PDF:' + err + '\n');
        } finally {
            server.close();
        }
    });
})();