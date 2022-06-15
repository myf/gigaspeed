const speedtest = require('./speedtest');
const publish = require('./ssb');
const lights = require('./lights');

const run = async () => {
    const content = await speedtest();
    const result = await publish(content);
    await lights.high();
    await lights.blink(5, lights.green);
    //process.exit(1);
    return;
}

run();
