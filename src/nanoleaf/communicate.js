const fetch = require('node-fetch');

const init = (options) => {

    return {

        put: async (url, data) => {

            const fullUrl = `http://${options.ip}:16021/api/v1/${options.token}${url}`;

            const result = await fetch(fullUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const text = await result.text();

            try {
                const json = JSON.parse(text);
                return json;
            } catch (err) {
                console.log('fullUrl', fullUrl);
                // console.log('err', err);
                console.log('status', result.status);
                console.log('data', data);
                console.log('text', text);
                return text;
            }

        },

        get: async (url) => {

            const fullUrl = `http://${options.ip}:16021/api/v1/${options.token}${url}`;

            const result = await fetch(fullUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const text = await result.text();

            try {
                const json = JSON.parse(text);
                return json;
            } catch (err) {
                console.log(err);
                console.log('text', text);
                return text;
            }


        }

    }

};

module.exports = init;
