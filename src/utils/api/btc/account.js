import * as bitcoin from 'bitcoinjs-lib';
import Lisk from '@liskhq/lisk-client'; // eslint-disable-line
import bip32 from 'bip32';
import { getAPIClient } from './network';
import { tokenMap } from '../../../constants/tokens';

export const getDerivedPathFromPassphrase = (passphrase, config) => {
  const seed = Lisk.passphrase.Mnemonic.mnemonicToSeedSync(passphrase);
  return bip32.fromSeed(seed, config.network).derivePath(config.derivationPath);
};

export const extractPublicKey = (passphrase, config) =>
  getDerivedPathFromPassphrase(passphrase, config).publicKey;

export const extractAddress = (passphrase, config) => {
  const publicKey = extractPublicKey(passphrase, config);
  const btc = bitcoin.payments.p2pkh({ pubkey: publicKey, network: config.network });
  return btc.address;
};

export const getAccount = params => new Promise(async (resolve, reject) => {
  const apiClient = getAPIClient(params.network);
  const address = params.address || extractAddress(
    params.passphrase, apiClient.config,
  );
  await apiClient.get(`account/${address}`).then((response) => {
    resolve({
      address,
      balance: response.body.data.confirmed_balance,
      initialized: true,
      token: tokenMap.BTC.key,
    });
  }).catch(reject);
});
