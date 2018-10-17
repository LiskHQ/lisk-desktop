#!/bin/bash

LISK_CORE=${LISK_CORE:-http://localhost:4000}
# can be used to point to commander, e.g.:
# COMMANDER="./node_modules/.bin/lisk" ./e2e-transactions.sh
# COMMANDER="docker-compose run --rm commander ./node_modules/.bin/lisk" ./e2e-transactions.sh
COMMANDER="lisk"
PASSPHRASE="wagon stock borrow episode laundry kitten salute link globe zero feed marble"

function create_transaction(){
	REQUEST=$( mktemp --tmpdir=. )
	$COMMANDER create transaction transfer --passphrase="pass:$PASSPHRASE" $1 $2 >$REQUEST
	echo $REQUEST
}

function post_transaction(){
	if ! curl --silent --fail --header Content-Type:application/json \
	          --data @$1 $LISK_CORE/api/transactions >$1.response; then
		echo "$1 failed"
	fi
}

function transfer(){
	post_transaction $( create_transaction $1 $2 )
}
transfer 100.1 1155682438012955434L

for i in {1..20}; do
	transfer ${i}00 537318935439898807L
done

transfer 100 544792633152563672L
transfer 100 4264113712245538326L
transfer 100.1 16422276087748907680L
transfer 10.1 94495548317450502L

sleep 10
$COMMANDER create transaction register second passphrase \
  --passphrase="pass:awkward service glimpse punch genre calm grow life bullet boil match like" \
  --second-passphrase="pass:forest around decrease farm vanish permit hotel clay senior matter endorse domain" >data
post_transaction data
