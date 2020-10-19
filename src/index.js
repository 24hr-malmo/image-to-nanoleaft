const jimp = require('jimp');
const zeroFill = require('zero-fill');

const nanoleaf = require('./nanoleaf');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

    let debug = [];


    matrixRows.forEach((row, y) => {
        const items = row.split(' ');
        maxY = y;
        items.forEach((column, x) => {
            maxX = x;
            let [clientId, panelId, calibrationColor] = column.split(':');
            panelId = parseInt(panelId, 10);
            debug.push(`${x},${y}-${zeroFill(5, panelId, ' ')}:${clientId}`);
            matrixControlList[`${x},${y}`] = async (r, g, b) => {
                if (calibrationColor) {
                    [r,g,b] = calibrationColor.split(',');
                }
                return await clients[clientId].setPanelColor(panelId, r, g, b);
            };
        });
    });

    const debugList = debug.reduce((all, item, index) => {
        const rowIndex = Math.floor(index / ( maxX + 1));
        if (!all[rowIndex]) {
            all.push([]);
        }
        all[rowIndex].push(item);
        return all;
    }, []);

    //    debugList.forEach(row => {
    // console.log(row.join('\t'));
    // });

    return {
        width: maxX + 1,
        height: maxY + 1,
        setColor: async (x, y, r, g, b) => {
            try {
                await matrixControlList[`${x},${y}`](r, g, b);
                console.log('\tOK', x, y, r, g, b);
            } catch (err) {
                console.log('\tError with', x, y, err.code);
            }
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

    let image = await jimp.read(imageSource);
    image = await image.resize(matrixControl.width, matrixControl.height, jimp.RESIZE_BILINEAR);

    let x = 0;
    let y = 0;

    for (let idx = 0, idxx = 4 * image.bitmap.width * image.bitmap.height; idx < idxx; idx += 4) {

        const position = idx / 4;

        let red = image.bitmap.data[idx + 0];
        let green = image.bitmap.data[idx + 1];
        let blue = image.bitmap.data[idx + 2];
        let alpha = image.bitmap.data[idx + 3];

        x = position % image.bitmap.width;
        y = Math.floor(position / image.bitmap.width);
        const result = matrixControl.setColor(x, y, red, green, blue);

        // await wait(100);


    }

    //     image
    //     // .resize(2, matrixControl.width, matrixControl.height)
    //         .scan(0, 0, image.bitmap.width, image.bitmap.height, async (x, y, idx) => {
    // 
    //             console.log('====', x, y);
    //         });
    // 
};


