const fs = require('fs');
const packageConfig = require('./../package.json');
const manifest = require('./_manifest.json');

manifest.version = packageConfig.version;
baseUrl = (process.env.SPOTIFY_REDIRECT_URL).replace(/\/$/g, '');

let output = JSON.stringify(manifest);
output.replace('{{base_url}}', baseUrl);

fs.writeFile(__dirname + '/../../public/manifest.json', , err => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
});