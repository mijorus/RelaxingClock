const fs = require('fs');
const packageConfig = require('./../package.json');
const manifest = require('./_manifest.json');

manifest.version = packageConfig.version;
manifest.start_url = process.env.SPOTIFY_REDIRECT_URL;

fs.writeFile(__dirname + './../../public/manifest.json', JSON.stringify(manifest), err => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
});