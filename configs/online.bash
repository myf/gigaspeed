#! /usr/bin/bash

if [ $IFACE == "eth0" ]; then
	echo "eth0 on"
	echo '{"status": "Connected", "quality": "just connected"}' > /home/giga/GIGANode/Frontend/data/status.json
	/usr/bin/node /home/giga/giga/cli.js lights --status=on
fi
