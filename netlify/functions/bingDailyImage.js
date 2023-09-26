const got = require('got');

exports.handler = async function (event, context) {
    console.log(event);
    console.log(context);

    const headers = {
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'GET') {
        const res = await got.get('https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US', {
            responseType: 'json',
        }).json();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ url: 'https://www.bing.com' + res.images[0].url})
        };
    } else {
        return {
            headers,
            statusCode: 405,
            body: 'Method not supported'
        };
    }
};
