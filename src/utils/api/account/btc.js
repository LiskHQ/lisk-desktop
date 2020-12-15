import bitcoin from 'bitcoinjs-lib';
import Lisk from '@liskhq/lisk-client'; // eslint-disable-line
import bip32 from 'bip32';

import { tokenMap } from '../../../constants/tokens';
import http from '../http';

/**
 * Derives wallet derivation path from passphrase
 *
 * @param {String} passphrase Valid Mnemonic passphrase
 * @param {Object} network Network setting from the Redux store
 * @returns {String} derivation path
 */
export const getDerivedPathFromPassphrase = (passphrase, network) => {
  const seed = Lisk.passphrase.Mnemonic.mnemonicToSeedSync(passphrase);
  return bip32.fromSeed(seed, network.networks.BTC.network)
    .derivePath(network.networks.BTC.derivationPath);
};

/**
 * Derives public key from passphrase
 *
 * @param {String} passphrase Valid Mnemonic passphrase
 * @param {Object} network Network setting from the Redux store
 * @returns {String} account publicKey
 */
export const extractPublicKey = (passphrase, network) =>
  getDerivedPathFromPassphrase(passphrase, network).publicKey;

/**
 * Derives address from passphrase
 *
 * @param {String} passphrase Valid Mnemonic passphrase
 * @param {Object} network Network setting from the Redux store
 * @returns {String} account address
 */
export const extractAddress = (passphrase, network) => {
  const publicKey = extractPublicKey(passphrase, network);
  const btc = bitcoin.payments.p2pkh({ pubkey: publicKey, network: network.networks.BTC.network });
  return btc.address;
};

const normalizeAccountResponse = ({
  response, address,
}) => ({
  address,
  balance: response.body.data.confirmed_balance,
  initialized: true,
  token: tokenMap.BTC.key,
});

/**
 * Retrieves the details of a single BTC account for a given id
 * Converts the response to match Lisk data structure
 *
 * @param {Object} data
 * @param {Object} data.params
 * @param {String?} data.params.address - Valid Bitcoin address
 * @param {String?} data.params.passphrase - Valid Mnemonic passphrase
 * @param {Object} data.network - Network setting from Redux store
 * @returns {Promise} Transaction details API call
 */
export const getAccount = ({
  network,
  params,
}) => {
  const address = params.address || extractAddress(
    params.passphrase, network,
  );

  return http({
    network,
    path: `/account/${address}`,
  }).then(response => normalizeAccountResponse({
    response,
    address,
  }));
};
