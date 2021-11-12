#!/bin/bash

server='root@srv.alimd.ir'
serverPath='srv/najafi-telegram-bot/'

echoStep() {
	echo -e "\033[0;33m→ \033[0;35m $1 \033[0m"
}

remoteShell () {
	ssh $server $1
}

syncFolder() {
	echoStep 'Uploading...'
	rsync -raz \
		--exclude='node_modules' \
			--exclude='.git' \
				./ $server:$serverPath
	echoStep 'Syncing complete.'
}

echoStep 'Start...'

syncFolder

remoteShell "chmod u+x $serverPath/up.sh && $serverPath/up.sh"

echoStep 'Done!'
