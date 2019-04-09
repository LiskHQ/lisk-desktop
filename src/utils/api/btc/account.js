import bitcoin from 'bitcoinjs-lib';
import Lisk from 'lisk-elements';
import bip32 from 'bip32';
import config from '../../../../btc.config';

export const getSummary = address => new Promise(async (resolve, reject) => {
  try {
    const response = await fetch(`${config.url}/balance?active=${address}`, config.requestOptions);
    const json = await response.json();

    if (response.ok) {
      resolve({
        address,
        balance: json[address].final_balance,
        initialized: true,
      });
    } else {
      reject(json);
    }
  } catch (error) {
    reject(error);
  }
});

export const getDerivedPathFromPassphrase = (passphrase) => {
  const seed = Lisk.passphrase.Mnemonic.mnemonicToSeed(passphrase);
  return bip32.fromSeed(seed, config.network).derivePath(config.derivationPath);
};

export const extractPublicKey = passphrase => getDerivedPathFromPassphrase(passphrase).publicKey;

export const extractAddress = (passphrase) => {
  const publicKey = extractPublicKey(passphrase);
  const btc = bitcoin.payments.p2pkh({ pubkey: publicKey, network: config.network });
  return btc.address;
};
