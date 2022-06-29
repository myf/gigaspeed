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
            await lights_switch(argv.status);
            break;
        default:
            console.log(`unrecognized action ${argv._[0]}`)
            console.log(argv);
            break;
    }
}

const lights_switch = async (sta) => {
    switch(sta) {
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
	    console.log(`you sure ${sta}`);
	    console.log(argv)
	    break;
    }
}

try {
    cli();
}catch(e) {
    console.error(e);
}

