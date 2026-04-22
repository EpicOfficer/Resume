const { execSync } = require("child_process");
const path = require("path");

exports.onPostBuild = async ({ reporter }) => {
    if (process.env.SKIP_PDF_POSTBUILD === "1") {
        reporter.info("Skipping PDF generation because SKIP_PDF_POSTBUILD=1");
        return;
    }

    reporter.info("Gatsby build complete. Generating export.pdf...");

    const scriptPath = path.join(__dirname, "scripts", "generate-pdf.mjs");

    try {
        execSync(`node ${scriptPath}`, { stdio: "inherit" });
        reporter.info("PDF generated successfully.");
    } catch (error) {
        reporter.panicOnBuild("Post-build PDF generation failed", error);
    }
};
