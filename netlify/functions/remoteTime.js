const axios = require('axios');

exports.handler = async function (event, context) {
    const received = Date.now();

    if (event.httpMethod === 'GET') {
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                unixtime: Math.floor(Date.now()),
                compleated: Date.now() - received,
            })
        }
    } else {
        return {
            statusCode: 405,
            body: 'Method not supported'
        }
    }
}
