const util = require('util');
const { exec } = require('child_process');
const exp = util.promisify(exec);

const process = async () => {
    const json = await exp('/usr/bin/speedtest-cli --json');
    return new Promise((res, rej)=> {
        if (json.stderr !== '') { rej(json.stderr); }
        res(json.stdout);
    })
}


const morph_result = (json) => {
    const type = 'speedtest';
    const obj = JSON.parse(json);
    const download = obj.download;
    const upload = obj.upload;
    const ping = obj.ping;
    const ip = obj.client.ip
    const isp = obj.client.isp;
    const lat = obj.client.lat;
    const lon = obj.client.lon;
    const content =obj;
    return { 
            type,
            download,
            upload,
            ping,
            ping,
            ip,
            isp,
            lat,
            lon,
            content}
}

const speedtest = async() => {
    const json = await process();
    console.log(morph_result(json));
    return morph_result(json);
}

module.exports = speedtest;
