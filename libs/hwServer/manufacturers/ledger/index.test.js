import { expect } from 'chai';

import { LEDGER } from './constants';
import * as ledger from './index';

jest.mock('@liskhq/lisk-client');
jest.mock('@zondax/ledger-lisk', () => ({
  LedgerAccount: () => ({
    derivePath: () => Buffer.from(''),
    account: () => ({
      publicKey: Buffer.from('0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a'),
    }),
  }),
  LiskApp: () => ({
    getAddressAndPubKey: () => ({
      publicKey: Buffer.from('0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a'),
    }),
    showAddressAndPubKey: () => ({
      publicKey: Buffer.from('0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a'),
      address: '',
    }),
    sign: () => Buffer.from('68656c6c6f'),
    signMessage: () => Buffer.from('hello'),
  }),
}));

describe.skip('ledger', () => {
  const device = {
    deviceId: `${Math.floor(Math.random() * 1e5) + 1}`,
    productName: LEDGER.name,
    path: '',
    manufacturer: LEDGER.name,
  };
  const data = {
    index: 0,
    showOnDevice: true,
    networkIdentifier: Buffer.from('networkIdentifier'),
    transactionBytes: Buffer.from('transactionBytes'),
    message: Buffer.from('hello'),
  };
  const transporter = {
    open: () => ({ close: () => jest.fn() }),
  };
  const publicKey = Buffer.from('0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a');

  it('Should return device info when device is connected', async () => {
    // Act
    const isInsideLiskApp = await ledger.default.checkIfInsideLiskApp({ transporter, device });
    // Assert
    expect(isInsideLiskApp).to.eql({
      ...device,
    });
  });

  it('Should return public key from ledger account', async () => {
    // Act
    const pubKey = await ledger.default.getPublicKey(transporter, { device, data });
    // Assert
    expect(pubKey).to.eql(publicKey);
  });

  it('Should return address from ledger account', async () => {
    // Act
    const pubKey = await ledger.default.getPublicKey(transporter, { device, data });
    // Assert
    expect(pubKey).to.eql(publicKey);
  });

  it('Should return signed transaction from ledger device', async () => {
    // Act
    const signedTrx = await ledger.default.signTransaction(transporter, { device, data });
    // Assert
    expect(signedTrx).to.eql(Buffer.from('68656c6c6f'));
  });

  it('Should return signed message from ledger device', async () => {
    // Act
    const signedMsg = await ledger.default.signMessage(transporter, { device, data });
    // Assert
    expect(signedMsg).to.eql(Buffer.from('hello'));
  });
});
