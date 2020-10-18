const communicate = require('./communicate');

module.exports = (options) => {

    const fetch = communicate(options);

    return {
        getInfo: require('./get-info')(fetch),
        getToken: require('./get-token')(fetch),
        setPanelColor: require('./set-panel-color')(fetch),
    };

};
