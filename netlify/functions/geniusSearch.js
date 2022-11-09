const got = require('got');

exports.handler = async function (event, context) {
    console.log(event);
    console.log(context);

    if (event.httpMethod === 'GET') {
        if (!event.queryStringParameters.q) {
            return {
                statusCode: 406,
                body: 'Missing query'
            }
        }

        const res = await got.get('https://api.genius.com/search', {
            responseType: 'json',
            headers: {
                'Authorization': 'Bearer ' + GENIUS_ACCESS_TOKEN
            },
            searchParams: {
                q: event.queryStringParameters.q
            }
        }).json();

        console.log(res);

        // let responseData = res;
        let responseData = res.response.hits.find(el => el.type === 'song');

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: responseData,
            })
        }
    } else {
        return {
            statusCode: 405,
            body: 'Method not supported'
        }
    }
}
