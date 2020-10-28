#!/bin/bash

lisk config:set api.nodes http://localhost:4000

NETWORKIDENTIFIER="93d00fe5be70d90e7ae247936a2e7d83b50809c79b73fa14285f02c842348b3e"
GENESIS_NONCE=103
MULTISIG_CANDIATE_NONCE=0
# genesis
PASSPHRASE1="peanut hundred pen hawk invite exclude brain chunk gadget wait wrong ready"
OPTIONALKEY1="0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a"

# delegate
PASSPHRASE2="recipe bomb asset salon coil symbol tiger engine assist pact pumpkin visit"
OPTIONALKEY2="86499879448d1b0215d59cbf078836e3d7d9d2782d56a2274a568761bff36f19"

# mutisig candidate passphrase
PASSPHRASE3="approve tribe main deposit luxury obtain knock problem pulse claw social select"

# nonce amount recipient 
function transfer(){
	lisk transaction:broadcast $(lisk transaction:create:transfer $1 0.1 $2 $3 --data=$4 --passphrase="$PASSPHRASE1" --networkIdentifier=$NETWORKIDENTIFIER)
}

# transfer tokens to this account earlier so that it has some balance in subsequent blocks
transfer ${GENESIS_NONCE} 1000 1941002779612196826L multisig-candidate

for i in {2..50}; do
  CURRENT=$(( $i + $GENESIS_NONCE - 1 ))
	transfer ${CURRENT} ${i}00 537318935439898807L test
done

transfer 154 90 544792633152563672L delegate-candidate
transfer 155 70 16422276087748907680L send-all-account
transfer 156 1 94495548317450502L without-initialization

# register multisig account with the multiSig_candidate account
# transaction:create:multisignature {nonce} {fee} --mandatory-key="xxx" --mandatory-key="yyy" --optional-key="yyy" --optional-key="yyy" --number-of-signatures=4 --passphrase="****" --member-passphrase="****" --member-passphrase="****" 
TRANSACTION1=$(lisk transaction:create:multisignature "$MULTISIG_CANDIATE_NONCE" 0.1 --number-of-signatures=2 --optional-key="$OPTIONALKEY1" --optional-key="$OPTIONALKEY2" --passphrase="$PASSPHRASE3" --member-passphrase="$PASSPHRASE1" --member-passphrase="$PASSPHRASE2" --networkIdentifier="$NETWORKIDENTIFIER")

# sign the registration transaction with genesis account
TRANSACTION2=$(lisk transaction:sign "$TRANSACTION1" --optional-key="$OPTIONALKEY1" --optional-key="$OPTIONALKEY2" --passphrase="$PASSPHRASE1" --networkIdentifier="$NETWORKIDENTIFIER")

# broadcast the tx
lisk transaction:broadcast "$TRANSACTION2"

# wait for the account registration tx to be included in the blockchain
sleep 15

# create and broadcast a multisig tx
TRANSACTION3=$(lisk transaction:create:transfer 1 0.1 1 5932438298200837883L --networkIdentifier="$NETWORKIDENTIFIER" --passphrase="$PASSPHRASE3")

# sign using one member
TRANSACTION4=$(lisk transaction:sign "$TRANSACTION3" --optional-key="$OPTIONALKEY1" --optional-key="$OPTIONALKEY2" --passphrase="$PASSPHRASE1" --networkIdentifier="$NETWORKIDENTIFIER")

# sign using another member
TRANSACTION5=$(lisk transaction:sign "$TRANSACTION4" --optional-key="$OPTIONALKEY1" --optional-key="$OPTIONALKEY2" --passphrase="$PASSPHRASE2" --networkIdentifier="$NETWORKIDENTIFIER")

lisk transaction:broadcast "$TRANSACTION5"
