const jimp = require('jimp');

const nanoleaf = require('./nanoleaf');

const createMatrixControl = (options) => {

    const clients = options.controllers.reduce((all, controller) => {
        all[controller.id] = nanoleaf(controller);
        return all;
    }, {});

    let matrixRows = options.matrix.split('\n');
    matrixRows = matrixRows
        .map(row => row.replace(/(^\s+|\s+$)/g, ''))
        .filter(row => row !== '')
        .map(row => row.replace(/\s+/g, ' '));

    matrixControlList = {};

    let maxX = 0;
    let maxY = 0;

    matrixRows.forEach((row, y) => {
        const items = row.split(' ');
        maxY = y;
        items.forEach((column, x) => {
            maxX = x;
            const [clientId, panelId] = column.split(':');
            matrixControlList[`${x},${y}`] = async (r, g, b) => {
                return await client.setPanelColor(panelId, r, g, b);
            };
        });
    });

    return {
        width: maxX + 1,
        height: maxY + 1,
        setColor: async (x, y, r, g, b) => {
            return await matrixControlList[`${x},${y}`](r, g, b);
        },
        controllers: clients,
    };

};

exports.getPanelIds = async (options) => {

    const matrixControl = createMatrixControl(options);
    const ids = Object.keys(matrixControl.controllers);

    const panels = {};

    for (let i = 0, ii = ids.length; i < ii; i++) {
        const id = ids[i];
        const result = await matrixControl.controllers[id].getInfo();
        const panelIds = result.panelLayout.layout.positionData.map(data => data.panelId);
        panels[id] = panelIds;
    }

    return panels;

};

exports.getTokens = async (options) => {

    const matrixControl = createMatrixControl(options);
    const ids = Object.keys(matrixControl.controllers);

    const tokens = {};

    for (let i = 0, ii = ids.length; i < ii; i++) {
        const id = ids[i];
        const result = await matrixControl.controllers[id].getToken();
        tokens[id] = result;
    }

    return tokens;

};


exports.draw = async (options, imageSource) => {

    const matrixControl = createMatrixControl(options);

    const image = await jimp.read(imageSource);

    image
        .resize(matrixControl.width, matrixControl.height)
        .scan(0, 0, image.bitmap.width, image.bitmap.height, async (x, y, idx) => {

            var red = image.bitmap.data[idx + 0];
            var green = image.bitmap.data[idx + 1];
            var blue = image.bitmap.data[idx + 2];
            var alpha = image.bitmap.data[idx + 3];

            const result = await matrixControl.setColor(x, y, red, green, blue);

        });

};


