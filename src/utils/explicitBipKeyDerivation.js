import Mnemonic from 'bitcore-mnemonic';
import nacl from 'tweetnacl';
import createHmac from 'create-hmac';

const ED25519_CURVE = 'ed25519 seed';
const HARDENED_OFFSET = 0x80000000;

const getMasterKeyFromSeed = (seed) => {
  const hmac = createHmac('sha512', ED25519_CURVE);
  const I = hmac.update(Buffer.from(seed, 'hex')).digest();
  const IL = I.slice(0, 32);
  const IR = I.slice(32);
  return {
    key: IL,
    chainCode: IR,
  };
};

const ckdPriv = ({ key, chainCode }, index) => {
  const indexBuffer = Buffer.allocUnsafe(4);
  indexBuffer.writeUInt32BE(index, 0);
  const data = Buffer.concat([Buffer.alloc(1, 0), key, indexBuffer]);
  const I = createHmac('sha512', chainCode)
    .update(data)
    .digest();
  const IL = I.slice(0, 32);
  const IR = I.slice(32);
  return {
    key: IL,
    chainCode: IR,
  };
};

export const defaultDerivationPath = "m/44'/134'/0'";

export const getCustomDerivationPublicKey = (passphrase, path = defaultDerivationPath) => {
  const mn = new Mnemonic(passphrase);
  const masterSeed = mn.toSeed();

  let node = getMasterKeyFromSeed(masterSeed);

  const segments = path.split('/')
    .slice(1)
    .map(el => el.replace("'", ''))
    .map(el => parseInt(el, 10));

  segments.forEach((index) => {
    node = ckdPriv(node, index + HARDENED_OFFSET);
  });

  const keyPair = nacl.sign.keyPair.fromSeed(node.key);

  return Buffer.from(keyPair.publicKey).toString('hex');
};
