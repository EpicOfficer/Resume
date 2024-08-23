// gatsby-node.js
const { exec } = require('child_process');
const path = require('path');

exports.onPostBuild = async () => {
    console.log("Gatsby build is complete. Running post-build script...");
    const scriptPath = path.join(__dirname, 'scripts', 'generate-pdf.mjs');
    console.log(`Executing script at path: ${scriptPath}`);

    exec(`node ${scriptPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error generating PDF: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Error: ${stderr}`);
            return;
        }
        console.log(stdout);
        console.log("Post-build script executed successfully.");
    });
};