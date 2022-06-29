const INTENSITY = 0.2;
const LENGTH = 71;
const TIMEOUT = 300;
const dotstar = require('dotstar');
const SPI = require('pi-spi');

spi = SPI.initialize('/dev/spidev0.0');
const ledStripLength = LENGTH;

let Lights = {};

Lights.init = () => {
    const ledStrip = new dotstar.Dotstar(spi, {
      length: ledStripLength
    });
    return ledStrip;
}

Lights.red = [255, 0, 0];
Lights.yellow = [255, 115, 0];
Lights.green = [0, 255, 0];
Lights.blue = [0, 0, 255];

Lights.on = (color, intensity, ledStrip) => {
    ledStrip = ledStrip || Lights.init();
	ledStrip.all(...color, intensity || INTENSITY);
	ledStrip.sync();
}

Lights.onset = async(color) => {
    const steps = 5;
    const duration = 100;
    for (let i=0; i<steps; i++) {
        const intensity = INTENSITY / (steps - i )
        await Lights.on(color, intensity);
        await sleep(duration / steps)
    }
    return;
}

Lights.off = () => {
    const ledStrip = Lights.init();
    ledStrip.clear();
    ledStrip.sync();
    return;
}

const sleep =(timeout) => new Promise((res, rej) => {setTimeout(res, timeout || TIMEOUT)});

const blink_once = async (color) => {
    await Lights.onset(color);
    await sleep();
    await Lights.off();
    await sleep();
}

const blink = async(times, color) => {
    for (let i = times; i>0; i--) {
        await blink_once(color);
    }
    return;
}

Lights.blink = blink;

const matrix = [2, 8, 15, 20, 15, 8, 2];

const line = (num, color, ledStrip) => {
    ledStrip = ledStrip || Lights.init();
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
    const l = Lights.init();
    for (let i=3; i>=0 ; i--) {
        line(i, Lights.blue, l);
        line(6-i, Lights.blue, l);
        await sleep();
    }
    await blink(3, Lights.blue);
    await Lights.onset(Lights.blue);
    return;
}

const bar = async (num, color, ledStrip) => {
    for (let i = 0; i< num; i++) {
        line(6-i, color, ledStrip);
        await sleep();
    }
    return;
}

Lights.low = async() => {
    const l = Lights.init()
    await bar(3, Lights.red, l);
    await blink(3, Lights.red);
    await Lights.onset(Lights.red);
    return;
}

Lights.med = async() => {
    const l = Lights.init()
    await bar(5, Lights.yellow, l);
    await blink(3, Lights.yellow);
    await Lights.onset(Lights.yellow);
    return;
}

Lights.high = async() => {
    const l = Lights.init()
    await bar(7, Lights.green, l);
    await blink(3, Lights.green);
    await Lights.onset(Lights.green);
    return;
}

Lights.connected = async() => {
    await Lights.onset(Lights.blue);
    await sleep(2000); // benedetta wants 2 second
    await blink(3, Lights.green);
    await Lights.onset(Lights.green);
    return;
}

Lights.disconnected = async() => {
    await blink(3, Lights.red);
    await Lights.onset(Lights.red);
    return;
}

module.exports = Lights;
