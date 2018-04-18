import Lisk from 'lisk-js';

export const extractPublicKey = passphrase =>
  Lisk.crypto.getKeys(passphrase).publicKey;

/**
* @param {String} data - passphrase or public key
*/
export const extractAddress = (data) => {
  if (!data) {
    return false;
  }
  if (data.indexOf(' ') < 0) {
    return Lisk.crypto.getAddress(data);
  }
  const { publicKey } = Lisk.crypto.getKeys(data);
  return Lisk.crypto.getAddress(publicKey);
};
