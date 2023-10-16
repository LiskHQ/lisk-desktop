#!/bin/sh
# spin up enevti core
if [ $CORE == "enevti" ]
  then
    if [ ! -d "../enevti-core" ]
      then
        curl -O https://lisk-qa.ams3.digitaloceanspaces.com/enevti-core-desktop.tar.gz
        tar -xf enevti-core-desktop.tar.gz
        mv -f enevti-core ../enevti-core
        rm -rf enevti-core-desktop.tar.gz 
    fi

    rm -rf ~/.enevti
    cd ../enevti-core
    npm install
    ./bin/run blockchain:import --force ../lisk-desktop/e2e/artifacts/enevti-core/blockchain.tar.gz

    if [ ! -z "$USE_NOHUP" ]
      then
        nohup ./bin/run start --network=devnet --api-ws --api-host=0.0.0.0 --api-port=8887 >enevti-core.out 2>enevti-core.err &
        echo $! >enevti-core.pid
      else
        ./bin/run start --network=devnet --api-ws --api-host=0.0.0.0 --api-port=8887
    fi
fi

# spin up lisk core
if [ $CORE == "lisk" ]
  then
    if [ ! command -v lisk-core &> /dev/null ]
      then
        npm i -g lisk-core@^4.0.0-rc.3
    fi

    rm -rf ~/.lisk
    lisk-core blockchain:import --force ../lisk-desktop/e2e/artifacts/lisk-core/blockchain.tar.gz

    if [ ! -z "$USE_NOHUP" ]
      then
        nohup lisk-core start --network=devnet --api-ws --api-host=0.0.0.0 --config ./e2e/artifacts/lisk-core/config.json --overwrite-config >lisk-core.out 2>lisk-core.err &
        echo $! >lisk-core.pid
      else
        lisk-core start --network=devnet --api-ws --api-host=0.0.0.0 --config ./e2e/artifacts/lisk-core/config.json --overwrite-config
    fi
fi							