#!/bin/bash  

psql -c 'drop database lisk_test;' -U postgres
psql -c 'create database lisk_test;' -U postgres
psql -d lisk_test -c "alter user "$USER" with password 'password';"
git clone https://github.com/LiskHQ/lisk
cd lisk/
git checkout master
npm install
cd test/lisk-js/; npm install; cd ../..
cp test/config.json test/genesisBlock.json .

node app.js &> ../.lisk-core.log &
sleep 5
cd ..
for i in {1..20}
do 
  curl -k -H "Content-Type: application/json" -X PUT -d '{"secret":"wagon stock borrow episode laundry kitten salute link globe zero feed marble","amount":'"$i"0000000',"recipientId":"537318935439898807L"}' http://localhost:4000/api/transactions
  echo ''
done
sleep 10
