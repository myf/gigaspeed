const speedtest = require('./speedtest');
const publish = require('./ssb');
const lights = require('./lights');

const run = async () => {
    const content = await speedtest();
    const result = await publish(content);
    await lights.med();
    return;
}

module.exports = run;

