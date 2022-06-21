const minimist = require('minimist');
const run = require('./run');
const lights = require('./lights');
const argv = minimist(process.argv.slice(2));
const cli = async () => {
    switch (argv._[0]) {
        case "run": 
            await run();
            break;
        case "lights":
            switch(argv.status) {
                case "init":
                    await lights.init_seq();
                    break;
                case "on":
                    await lights.connected();
                    break;
                case "off":
                    await lights.disconnected();
                    break;
                default:
                    console.log(`you sure ${argv.status}`);
                    console.log(argv)
                    break;

            }
            break;
        default:
            console.log(`unrecognized action ${argv._[0]}`)
            console.log(argv);
            break;
    }
}

try {
    cli();
}catch(e) {
    console.error(e);
}

