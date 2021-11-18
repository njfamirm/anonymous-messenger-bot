#!/bin/bash

serverPath='srv/najafi-telegram-bot/'

echoStep() {
        echo -e "\033[0;33m→ \033[0;35m $1 \033[0m"
}

echoStep 'Building image...'

cd $serverPath

docker-compose build

echoStep 'Running image...'

  docker-compose up \
    --detach \
    --remove-orphans \
    --force-recreate
