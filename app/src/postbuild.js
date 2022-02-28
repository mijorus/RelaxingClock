const fs = require('fs');
const packageConfig = require('./../package.json');
const manifest = require('./_manifest.json');

manifest.version = packageConfig.version;
baseUrl = (process.env.SPOTIFY_REDIRECT_URL).replace(/\/$/g, '');

let output = JSON.stringify(manifest);
output = output.replace(/{{base_url}}/g, baseUrl);

console.log('Building web manifest...');
fs.writeFile(__dirname + '/../../public/manifest.json', output, err => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
});