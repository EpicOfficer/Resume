const { exec } = require('child_process');
const path = require('path');

exports.onPostBuild = async ({ reporter }) => {
    reporter.info("Gatsby build is complete. Running post-build script...");

    const scriptPath = path.join(__dirname, 'scripts', 'generate-pdf.mjs');
    reporter.info(`Executing script at path: ${scriptPath}`);

    // Logging the current working directory
    reporter.info(`Current working directory: ${process.cwd()}`);

    exec(`node ${scriptPath}`, (error, stdout, stderr) => {
        if (error) {
            reporter.panicOnBuild('Post-build script failed', error);
            return;
        }

        if (stderr) {
            reporter.warn(stderr);
        }

        if (stdout) {
            reporter.info(stdout);
        }

        reporter.info("Post-build script executed successfully.");
    });
};