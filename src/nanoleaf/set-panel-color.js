module.exports = (fetch) => async (panelId, red, green, blue) => {
    return await fetch.put('/effects', {
        write: {
            command: 'display', 
            animType : 'static', 
            animData : `1 ${panelId} 1 ${red} ${green} ${blue} 0 0 10`, 
            loop: false
        }
    });
};
