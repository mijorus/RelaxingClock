const got = require('got');

exports.handler = async function (event, context) {
    console.log(event);
    console.log(context);

    const headers = {
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'GET') {
        if (!event.queryStringParameters.q) {
            const res = await got.get('https://api.unsplash.com/photos/random?query=landscape&client_id=' + process.env.UNSPLASH_CLIENT_ID, {
                responseType: 'json',
            }).json();

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(
                    { urls: res.urls, user: { username: res.user.username, name: res.user.name }, location: res.location, description: res.description || '', created_at: res.created_at }
                )
            };
        } else {
            const res = await got.get('https://api.unsplash.com//search/photos?', {
                responseType: 'json',
                searchParams: {
                    per_page: 10,
                    query: event.queryStringParameters.q,
                    orientation: 'landscape',
                    client_id: process.env.UNSPLASH_CLIENT_ID,
                }
            }).json();

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(res.results.map(el => {
                    return { urls: el.urls, user: { username: el.user.username, name: el.user.name }, location: el.location, description: el.description || '', created_at: el.created_at };
                }))
            };
        }
    } else {
        return {
            headers,
            statusCode: 405,
            body: 'Method not supported'
        };
    }
};
