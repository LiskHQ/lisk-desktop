#!/bin/zsh

LISK_CORE_PATH="../../lisk-service/"
NODE_VERSION="v12.22.7"

cd "$LISK_CORE_PATH/jenkins/redis"

source ~/.bash_profile
pm2 stop ../../ecosystem.core3.config.js

make down
cd ../mariadb
make down

LISK_CORE_PID=$(pgrep -u $USER lisk-core);

if [$LISK_CORE_PID] 
then
   kill $LISK_CORE_PID;
fi
rm -r ~/.lisk

cd ../lisk-core

mkdir -p ~/.lisk/lisk-core/config/devnet/
cp config/genesis_block.json ~/.lisk/lisk-core/config/devnet/

lisk-core blockchain:import snapshots/blockchain.db.tar.gz --force
lisk-core forger-info:import snapshots/forger.db.tar.gz --force

cd ../mariadb
make up
cd ../redis
make up

lisk-core start --network=devnet --api-ws --api-ws-host=0.0.0.0 --api-ws-port=8888 --enable-forger-plugin --port=5050