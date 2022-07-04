const speedtest = require('./speedtest');
const publish = require('./ssb');
const lights = require('./lights');
const fs = require('fs/promises');

const run = async () => {
    const content = await speedtest();
    const result = await publish(content);
    await fs.writeFile('/home/giga/GIGANode/Frontend/data/wat.json', 
                       JSON.stringify([result]));
    await indicate(content);
    return;
}

const indicate = async (content) => {
    const speed_mb = content.download / 10**6;
    switch (true) {
        case speed_mb < 0.1:
            await lights.low();
            break;
        case (speed_mb > 0.1 && speed_mb < 20):
            await lights.med();
            break;
        case speed_mb > 20:
            await lights.high();
            break;
        default:
            console.error(`content is unparsable ${content}`);
            break;
    }
    return;
}

module.exports = run;

