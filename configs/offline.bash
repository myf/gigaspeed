#! /usr/bin/bash
if [ $IFACE == "eth0" ]; then
	echo "eth0 off"
	echo '{"status": "Disconnected", "quality": "not connected"}' > /home/giga/GIGANode/Frontend/data/status.json
	/usr/bin/node /home/giga/giga/cli.js lights --status=off
fi
