import * as bitcoin from 'bitcoinjs-lib';
import Lisk from 'lisk-elements';
import bip32 from 'bip32';
import getBtcConfig from './config';
import { getAPIClient } from './network';

export const getAccount = ({ networkConfig, address }) => new Promise(async (resolve, reject) => {
  await getAPIClient(networkConfig).get(`account/${address}`).then((response) => {
    resolve({
      address,
      balance: response.body.data.confirmed_balance,
      initialized: true,
    });
  }).catch(reject);
});

export const getDerivedPathFromPassphrase = (passphrase, netCode = 1) => {
  const config = getBtcConfig(netCode);
  const seed = Lisk.passphrase.Mnemonic.mnemonicToSeed(passphrase);
  return bip32.fromSeed(seed, config.network).derivePath(config.derivationPath);
};

export const extractPublicKey = (passphrase, netCode = 1) =>
  getDerivedPathFromPassphrase(passphrase, netCode).publicKey;

export const extractAddress = (passphrase, netCode = 1) => {
  const config = getBtcConfig(netCode);
  const publicKey = extractPublicKey(passphrase);
  const btc = bitcoin.payments.p2pkh({ pubkey: publicKey, network: config.network });
  return btc.address;
};
