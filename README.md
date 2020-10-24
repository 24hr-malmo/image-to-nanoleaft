# ImageToNanoleaf

A simple tool to convert an image to a Nanoleaf Canvas setup.
This tool was created so that multiple Nanoleaft controllers can be used together to
form a single big canvas of pixels.

## How it works

1. Setup your Nanoleaf Canvas
2. Get all the IPs for each controller
3. Create tokens for each controller by calling the following url after pressing the on/off button for about 5-7 seconds

    curl -X POST http://yournanoleaf.ip.num.ber:16021/api/v1/new

4. Write down each IP with each AUTH_TOKEN.
5. Now create the first part of config object:

```javascript
const path = require('path');
const imageToNanoleaf = require('image-to-nanoleaf');

const options = {
    controllers: [
        {
            id: 'p1', // Your identifier, can be anything
            token: 'token_for_the_controller_with_the_ip',
            ip: 'yournanoleaf.ip.num.ber',
        },
        {
            id: 'p2',
            token: 'token_for_the_controller_with_the_ip',
            ip: 'yournanoleaf.ip.num.ber2',
        }, 
        {
            id: 'p3',
            token: 'token_for_the_controller_with_the_ip',
            ip: 'yournanoleaf.ip.num.ber2',
        },
    ],
};

(async () => {
     const ids = await imageToNanoleaf.getPanelIds(options);
     console.log(ids);
})();
```

6. This will give you a list of all the panels and their ids for each controller.
7. Now extend your options object with:

```javascript
const path = require('path');
const imageToNanoleaf = require('image-to-nanoleaf');

const options = {
    controllers: [
        {
            id: 'p1', // Your identifier, can be anything
            token: 'token_for_the_controller_with_the_ip',
            ip: 'yournanoleaf.ip.num.ber',
        },
        {
            id: 'p2',
            token: 'token_for_the_controller_with_the_ip',
            ip: 'yournanoleaf.ip.num.ber2',
        }, 
        {
            id: 'p3',
            token: 'token_for_the_controller_with_the_ip',
            ip: 'yournanoleaf.ip.num.ber2',
        },
    ],
    matrix: `
          p1:8154   p2:61636   p3:22085 
          p1:42476  p2:48715   p3:39187 
          p1:35035  p2:39141   p3:37982 
          p1:3027   p2:8817    p3:29486 
          p1:6111   p2:62103   p3:44457 
    `,

    buffer: false, // if se to true, you need to call the render function after draw

};

(async () => {
     await imageToNanoleaf.draw(options, path.join(__dirname, './tree.png'));
})();
```


### buffering 

If you want to send all data with as few requests as possible, typically wehn an image should be draw all at once, set the ```buffer``` option to ```true```.

```javascript
const path = require('path');
const imageToNanoleaf = require('image-to-nanoleaf');

const options = {
    controllers: [
        {
            id: 'p1', // Your identifier, can be anything
            token: 'token_for_the_controller_with_the_ip',
            ip: 'yournanoleaf.ip.num.ber',
        },
        {
            id: 'p2',
            token: 'token_for_the_controller_with_the_ip',
            ip: 'yournanoleaf.ip.num.ber2',
        }, 
        {
            id: 'p3',
            token: 'token_for_the_controller_with_the_ip',
            ip: 'yournanoleaf.ip.num.ber2',
        },
    ],
    matrix: `
          p1:8154   p2:61636   p3:22085 
          p1:42476  p2:48715   p3:39187 
          p1:35035  p2:39141   p3:37982 
          p1:3027   p2:8817    p3:29486 
          p1:6111   p2:62103   p3:44457 
    `,

    buffer: true,

};

(async () => {
     const control = await imageToNanoleaf.draw(options, path.join(__dirname, './tree.png'));
     await control.render();
})();
```


8. Behold your beautiful image

The module uses Jimp to process the image, so whatever Jimp can read, this module can read,

In other words, this works as well:

     await imageToNanoleaf.draw(options, 'https://art.pixilart.com/d9a597fded1f8e6.png'); 

or

     await imageToNanoleaf.draw(options, yourCoolBuffer);

## Final comment

This has only been tested with Nanoleaf Canvas.


## Change Log

- 2020-10-24 - v0.6.0 : Added a bufffer mode so that you can add all info to all panels but draw them all at the same time (sending just one requesr for each controller)




