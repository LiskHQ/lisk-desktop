#!/bin/bash  
# Purpose of this script is to clean lisk database and create some tranactions

if [ -z "$1" ]
  then
    echo "One required argument missing: path to folder with lisk core app.js"
    exit 1
fi

pwd=`pwd`
cd $1
forever stop app.js
dropdb lisk_test && createdb lisk_test
forever start app.js
sleep 5
cd $pwd

./e2e-transactions.sh
