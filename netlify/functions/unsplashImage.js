const got = require('got');

exports.handler = async function (event, context) {
    console.log(event);
    console.log(context);

    const headers = {
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'GET') {
        const res = await got.get('https://api.unsplash.com/photos/random?query=landscape&client_id=' + process.env.UNSPLASH_CLIENT_ID, {
            responseType: 'json',
        }).json();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ urls: res.urls, user: { username: res.user.username, name: res.user.name }, location: res.location })
        };
    } else {
        return {
            headers,
            statusCode: 405,
            body: 'Method not supported'
        };
    }
};
