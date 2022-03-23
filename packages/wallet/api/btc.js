import bitcoin from 'bitcoinjs-lib';
import { passphrase as LiskPassphrase } from '@liskhq/lisk-client';
import bip32 from 'bip32';

import functionMapper from '@common/utilities/api/functionMapper';

/**
 * Derives wallet derivation path from passphrase
 *
 * @param {String} passphrase Valid Mnemonic passphrase
 * @param {Object} network Network setting from the Redux store
 * @returns {String} derivation path
 */
export const getDerivedPathFromPassphrase = (passphrase, network) => {
  const seed = LiskPassphrase.Mnemonic.mnemonicToSeedSync(passphrase);
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
  summary: {
    address,
    balance: response.data.confirmed_balance,
  },
  token: {
    balance: response.data.confirmed_balance,
  },
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
export const getAccount = async ({
  network,
  params,
}) => {
  const address = params.address || extractAddress(
    params.passphrase, network,
  );
  let account = {
    summary: {
      address,
      balance: 0,
    },
    token: {
      balance: 0,
    },
  };

  try {
    const response = await http({
      network,
      path: `/account/${address}`,
      baseUrl: network.networks.BTC.serviceUrl,
    });
    if (response.data) {
      account = normalizeAccountResponse({
        response,
        address,
      });
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('Bitcoin account not found.');
  }

  return account;
};
