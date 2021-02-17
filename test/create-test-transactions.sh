#!/bin/bash

lisk config:set api.nodes http://localhost:4000
PASSPHRASE="wagon stock borrow episode laundry kitten salute link globe zero feed marble"

function transfer(){
	lisk transaction:broadcast $(lisk transaction:create:transfer $1 $2 --data=$3 --passphrase="pass:$PASSPHRASE")
}

for i in {1..50}; do
	transfer ${i}00 537318935439898807L
done

transfer 100 1155682438012955434L second-passphrase-account
transfer 90 544792633152563672L delegate-candidate
transfer 80 4264113712245538326L second-passphrase-candidate
transfer 70 16422276087748907680L send-all-account
transfer 1 94495548317450502L without-initialization

sleep 10

lisk transaction:broadcast $(lisk transaction:create:transfer 0.1 544792633152563672L --data=account-initialization \
--passphrase="pass:right cat soul renew under climb middle maid powder churn cram coconut")

lisk transaction:broadcast $(lisk transaction:create:transfer 0.1 4264113712245538326L --data=account-initialization \
--passphrase="pass:dolphin inhale planet talk insect release maze engine guilt loan attend lawn")

lisk transaction:broadcast $(lisk transaction:create:second-passphrase \
--passphrase="pass:awkward service glimpse punch genre calm grow life bullet boil match like" \
--second-passphrase="pass:forest around decrease farm vanish permit hotel clay senior matter endorse domain")

lisk transaction:broadcast $(lisk transaction:create:vote \
--passphrase="pass:recipe bomb asset salon coil symbol tiger engine assist pact pumpkin visit" \
--votes 86499879448d1b0215d59cbf078836e3d7d9d2782d56a2274a568761bff36f19)

sleep 10

lisk transaction:broadcast $(lisk transaction:create:vote \
--passphrase="pass:recipe bomb asset salon coil symbol tiger engine assist pact pumpkin visit" \
--votes 01389197bbaf1afb0acd47bbfeabb34aca80fb372a8f694a1c0716b3398db746 \
--unvotes 86499879448d1b0215d59cbf078836e3d7d9d2782d56a2274a568761bff36f19)

# docker exec -t docker_db_1 pg_dump -U lisk lisk > ./dev_blockchain.db
