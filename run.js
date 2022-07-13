const speedtest = require('./speedtest');
const publish = require('./ssb');
const lights = require('./lights');
const fs = require('fs/promises');

const run = async () => {
    const content = await speedtest();
    const result = await publish(content);
    const quality = get_quality(content);
    await fs.writeFile('/home/giga/GIGANode/Frontend/data/wat.json', 
                       JSON.stringify([result]));
    await fs.writeFile('/home/giga/GIGANode/Frontend/data/status.json',
                       JSON.stringify({status: "Connected",
                                       quality: quality})); 
    await indicate(quality);
    return;
}

const get_quality = (content) => {
    const speed_mb = content.download / 10**6;
    let status;
    switch (true) {
        case speed_mb < 0.1:
            status = 'low';
            break;
        case (speed_mb > 0.1 && speed_mb < 20):
            status = 'medium';
            break;
        case speed_mb > 20:
            status = 'good'
            break;
        default:
            console.error(`content is unparsable ${content}`);
            status = 'error'
            break;
    }
    return status;
}
const quality_map = {
    good: lights.high,
    medium: lights.med,
    low: lights.low,
}

const indicate = async (quality) => {
    const func = quality_map[quality];
    await func();
    return;
}

module.exports = run;

