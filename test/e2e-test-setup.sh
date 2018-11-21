#!/bin/bash
# Purpose of this script is to clean lisk database and create some trasnactions

if [ -z "$1" ]
  then
    echo "One required argument missing: path to folder with lisk core app.js"
    exit 1
fi

pwd=`pwd`
cd $1
pm2 stop app.js
dropdb lisk_dev
createdb lisk_dev
gunzip -fcq "$pwd/test/dev_blockchain.db.gz" | psql -d lisk_dev
pm2 start app.js

sleep 5
cd $pwd

