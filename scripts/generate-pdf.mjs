import puppeteer from "puppeteer";
import { createServer } from "http-server";
import path from "node:path";

const serveDirectory = path.join(path.resolve(), "public");
const pdfPath = path.join(path.resolve(), "public", "export.pdf");
const url = "http://127.0.0.1:9000";

const server = createServer({ root: serveDirectory, cache: -1 });

async function generatePdf() {
    const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1440, height: 1800, deviceScaleFactor: 1 });
        await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
        await page.emulateMediaType("print");

        await page.pdf({
            path: pdfPath,
            format: "A4",
            scale: 0.95,
            printBackground: true,
            preferCSSPageSize: true,
            margin: { top: "0", right: "0", bottom: "0", left: "0" }
        });

        process.stdout.write(`PDF generated successfully: ${pdfPath}\n`);
    } finally {
        await browser.close();
    }
}

server.listen(9000, "127.0.0.1", async () => {
    try {
        await generatePdf();
    } catch (err) {
        process.stderr.write(`Error generating PDF: ${err}\n`);
        process.exitCode = 1;
    } finally {
        server.close();
    }
});
