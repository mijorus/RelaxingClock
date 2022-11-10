const got = require('got');

exports.handler = async function (event, context) {
    console.log(event);
    console.log(context);

    const headers = {
        'Content-Type': 'application/json'
    }

    if (event.httpMethod === 'GET') {
        if (!event.queryStringParameters.q) {
            return {
                headers,
                statusCode: 406,
                body: 'Missing query'
            }
        }

        const res = await got.get('https://api.genius.com/search', {
            responseType: 'json',
            headers: {
                'Authorization': 'Bearer ' + process.env.GENIUS_ACCESS_TOKEN
            },
            searchParams: {
                q: event.queryStringParameters.q
            }
        }).json();

        let data = null;

        if (res.response.hits.length) {
            let { title, title_with_featured, url } = (res.response.hits.find(el => el.type === 'song'))?.result;
            data = { title, title_with_featured, url };
        }

        return {
            statusCode: 200,
           headers,
            body: JSON.stringify({
                data,
            })
        }
    } else {
        return {
            headers,
            statusCode: 405,
            body: 'Method not supported'
        }
    }
}
