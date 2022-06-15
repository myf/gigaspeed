const INTENSITY = 0.2;
const LENGTH = 71;
const TIMEOUT = 300;
const dotstar = require('dotstar');
const SPI = require('pi-spi');

spi = SPI.initialize('/dev/spidev0.0');
const ledStripLength = LENGTH;

const ledStrip = new dotstar.Dotstar(spi, {
  length: ledStripLength
});

let Lights = {};

Lights.red = [255, 0, 0];
Lights.yellow = [255, 115, 0];
Lights.green = [0, 255, 0];
Lights.blue = [0, 0, 255];

Lights.on = (color) => {
	ledStrip.all(...color, INTENSITY);
	ledStrip.sync();
}

Lights.off = () => {
    ledStrip.clear();
    ledStrip.sync();
}

const sleep =() => new Promise((res, rej) => {setTimeout(res, TIMEOUT)});

const blink_once = async (color) => {
    Lights.on(color);
    await sleep();
    Lights.off();
    await sleep();
}

Lights.blink = async(times, color) => {
    for (let i = times; i>0; i--) {
        await blink_once(color);
    }
    return;
}

const matrix = [2, 8, 15, 20, 15, 8, 2];

const line = (num, color) => {
    matrix.reduce((pre, cur,idx,arr) => {
        if (idx === num) {
            for (let i = pre; i < pre + cur; i++) {
                ledStrip.set(i, ...color, INTENSITY);
            }
        }
        return pre + cur;
    },0)
    ledStrip.sync();
}

Lights.init_seq = async () => {
    for (let i=3; i>=0 ; i--) {
        line(i, Lights.blue);
        line(6-i, Lights.blue);
        await sleep();
    }
    return;
}

const bar = async (num, color) => {
    for (let i = 0; i< num; i++) {
        line(6-i, color);
        await sleep();
    }
    return;
}

Lights.low = async() => {
    await bar(3, Lights.red);
}

Lights.med = async() => {
    await bar(5, Lights.yellow);
}

Lights.high = async() => {
    await bar(7, Lights.green);
}


module.exports = Lights;
