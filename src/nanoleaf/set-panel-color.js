module.exports = (fetch) => async (panelId, red, green, blue) => {

    let animData = '';
    if (Array.isArray(panelId)) {
        animData = panelId.length + ' ' + panelId.map(({panelId, r, g, b}) => `1 ${panelId} 1 ${r} ${g} ${b} 0 0 1`).join(' ');
    } else {
        animData = `1 ${panelId} 1 ${red} ${green} ${blue} 0 0 1`;
    }

    return await fetch.put('/effects', {
        write: {
            command: 'display', 
            animType : 'static', 
            animData,
            loop: false,
        }
    });
};
