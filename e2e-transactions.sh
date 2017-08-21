#!/bin/bash  
  curl -k -H "Content-Type: application/json" -X PUT -d '{"secret":"wagon stock borrow episode laundry kitten salute link globe zero feed marble","amount":'10010000000',"recipientId":"1155682438012955434L"}' http://localhost:4000/api/transactions

for i in {1..20}
do 
  curl -k -H "Content-Type: application/json" -X PUT -d '{"secret":"wagon stock borrow episode laundry kitten salute link globe zero feed marble","amount":'"$i"000000000',"recipientId":"537318935439898807L"}' http://localhost:4000/api/transactions
  echo ''
done

  curl -k -H "Content-Type: application/json" -X PUT -d '{"secret":"wagon stock borrow episode laundry kitten salute link globe zero feed marble","amount":'10000000000',"recipientId":"544792633152563672L"}' http://localhost:4000/api/transactions
  curl -k -H "Content-Type: application/json" -X PUT -d '{"secret":"wagon stock borrow episode laundry kitten salute link globe zero feed marble","amount":'10000000000',"recipientId":"4264113712245538326L"}' http://localhost:4000/api/transactions
  curl -k -H "Content-Type: application/json" -X PUT -d '{"secret":"wagon stock borrow episode laundry kitten salute link globe zero feed marble","amount":'10010000000',"recipientId":"16422276087748907680L"}' http://localhost:4000/api/transactions

sleep 10

curl -k -H "Content-Type: application/json"  -X PUT -d '{"secret":"awkward service glimpse punch genre calm grow life bullet boil match like","secondSecret":"forest around decrease farm vanish permit hotel clay senior matter endorse domain","publicKey":"fab9d261ea050b9e326d7e11587eccc343a20e64e29d8781b50fd06683cacc88" }'  http://localhost:4000/api/signatures
sleep 5

