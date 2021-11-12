#!/bin/bash

serverPath='srv/najafi-telegram-bot/'

echoStep() {
        echo -e "\033[0;33m→ \033[0;35m $1 \033[0m"
}

cd $serverPath

echoStep 'Building image...'

docker-compose build

echoStep 'Running image...'

docker-compose up \
  --detach \
  --remove-orphans \
  --force-recreate

docker ps -a
