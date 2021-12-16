#!/bin/zsh

USER=eniola
LISK_CORE_PATH="../../lisk-service/"

cd "$LISK_CORE_PATH"
source ~/.bash_profile

pm2 start ecosystem.core3.config.js
pm2 logs lisk-service-core










