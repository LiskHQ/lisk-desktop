import * as bitcoin from 'bitcoinjs-lib';
import Lisk from 'lisk-elements';
import bip32 from 'bip32';
import * as popsicle from 'popsicle';
import getBtcConfig from './config';

export const getSummary = (address, netCode = 1) => new Promise(async (resolve, reject) => {
  try {
    const config = getBtcConfig(netCode);
    const response = await popsicle.get(`${config.url}/account/${address}`)
      .use(popsicle.plugins.parse('json'));
    const json = response.body;

    if (response) {
      resolve({
        address,
        balance: json.data.confirmed_balance,
        initialized: true,
      });
    } else {
      reject(json);
    }
  } catch (error) {
    reject(error);
  }
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
