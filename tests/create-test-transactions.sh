#!/bin/bash

lisk config:set api.nodes http://localhost:4000

NETWORK_IDENTIFIER="93d00fe5be70d90e7ae247936a2e7d83b50809c79b73fa14285f02c842348b3e"
GENESIS_NONCE=103
MULTISIG_CANDIATE_NONCE=0
# genesis
PASSPHRASE_GENESIS="peanut hundred pen hawk invite exclude brain chunk gadget wait wrong ready"
PUBLICKEY_GENESIS="0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a"

# validator
PASSPHRASE_VALIDATOR="recipe bomb asset salon coil symbol tiger engine assist pact pumpkin visit"
PUBLICKEY_VALIDATOR="86499879448d1b0215d59cbf078836e3d7d9d2782d56a2274a568761bff36f19"

# mutisig candidate passphrase
PASSPHRASE_MULTISIG="approve tribe main deposit luxury obtain knock problem pulse claw social select"

# nonce amount recipient 
function transfer(){
	lisk transaction:broadcast $(lisk transaction:create:transfer $1 0.1 $2 $3 --data=$4 --passphrase="$PASSPHRASE_GENESIS" --networkIdentifier=$NETWORK_IDENTIFIER)
}

function registerValidator(){
	lisk transaction:broadcast $(lisk transaction:create:validator 0 11 validator --passphrase="recipe bomb asset salon coil symbol tiger engine assist pact pumpkin visit" --networkIdentifier=$NETWORKIDENTIFIER)
}

function stake() {
	lisk transaction:broadcast $(lisk transaction:create --type=13 156 0.1 --stakes="537318935439898807L,100" --passphrase="peanut hundred pen hawk invite exclude brain chunk gadget wait wrong ready" --networkIdentifier=93d00fe5be70d90e7ae247936a2e7d83b50809c79b73fa14285f02c842348b3e)
	sleep 20
	lisk transaction:broadcast $(lisk transaction:create --type=13 157 0.1 --stakes="537318935439898807L,-20" --passphrase="peanut hundred pen hawk invite exclude brain chunk gadget wait wrong ready" --networkIdentifier=93d00fe5be70d90e7ae247936a2e7d83b50809c79b73fa14285f02c842348b3e)
}

for i in {1..50}; do
  CURRENT=$(( $i + $GENESIS_NONCE - 1 ))
	transfer ${CURRENT} ${i}00 537318935439898807L test
done

transfer 153 1000 1941002779612196826L multisig-candidate
transfer 154 90 544792633152563672L validator-candidate
transfer 155 70 16422276087748907680L send-all-account
transfer 156 1 94495548317450502L without-initialization

# wait for the account registration tx to be included in the blockchain
sleep 20
registerValidator
sleep 20
stake

# initialize accounts
transfer 158 1 544792633152563672L account-initializer
transfer 159 1 4264113712245538326L account-initializer

sleep 20

lisk transaction:broadcast $(lisk transaction:create:transfer 0 0.1 1 544792633152563672L --data=account-initialization \
--passphrase="right cat soul renew under climb middle maid powder churn cram coconut" --networkIdentifier=$NETWORKIDENTIFIER)

lisk transaction:broadcast $(lisk transaction:create:transfer 0 0.1 1 4264113712245538326L --data=account-initialization \
--passphrase="dolphin inhale planet talk insect release maze engine guilt loan attend lawn" --networkIdentifier=$NETWORKIDENTIFIER)

# register multisig account with the multiSig_candidate account
# transaction:create:multisignature {nonce} {fee} --mandatory-key="xxx" --mandatory-key="yyy" --optional-key="yyy" --optional-key="yyy" --number-of-signatures=4 --passphrase="****" --member-passphrase="****" --member-passphrase="****" 
TRANSACTION1=$(lisk transaction:create:multisignature "$MULTISIG_CANDIATE_NONCE" 0.1 --number-of-signatures=2 --optional-key="$PUBLICKEY_GENESIS" --optional-key="$PUBLICKEY_VALIDATOR" --passphrase="$PASSPHRASE_MULTISIG" --member-passphrase="$PASSPHRASE_GENESIS" --member-passphrase="$PASSPHRASE_VALIDATOR" --networkIdentifier="$NETWORK_IDENTIFIER")
# sign the registration transaction with genesis account
TRANSACTION2=$(lisk transaction:sign "$TRANSACTION1" --optional-key="$PUBLICKEY_GENESIS" --optional-key="$PUBLICKEY_VALIDATOR" --passphrase="$PASSPHRASE_GENESIS" --networkIdentifier="$NETWORK_IDENTIFIER")
lisk transaction:broadcast "$TRANSACTION2"

# wait for the account registration tx to be included in the blockchain
sleep 20

# create and broadcast a multisig tx
TRANSACTION3=$(lisk transaction:create:transfer 1 0.1 1 5932438298200837883L --networkIdentifier="$NETWORK_IDENTIFIER" --passphrase="$PASSPHRASE_MULTISIG")
# sign using one member
TRANSACTION4=$(lisk transaction:sign "$TRANSACTION3" --optional-key="$PUBLICKEY_GENESIS" --optional-key="$PUBLICKEY_VALIDATOR" --passphrase="$PASSPHRASE_GENESIS" --networkIdentifier="$NETWORK_IDENTIFIER")
# sign using another member
TRANSACTION5=$(lisk transaction:sign "$TRANSACTION4" --optional-key="$PUBLICKEY_GENESIS" --optional-key="$PUBLICKEY_VALIDATOR" --passphrase="$PASSPHRASE_VALIDATOR" --networkIdentifier="$NETWORK_IDENTIFIER")
lisk transaction:broadcast "$TRANSACTION5"
