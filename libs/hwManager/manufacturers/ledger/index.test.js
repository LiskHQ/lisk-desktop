import { expect } from 'chai';
import * as apiClient from '@liskhq/lisk-client';

import {
  LEDGER,
} from './constants';
import * as ledger from './index';

jest.mock('@liskhq/lisk-client');
jest.mock('@hirishh/lisk-ledger.js', () => ({
  LedgerAccount: () => ({
    derivePath: () => Buffer.from(''),
    account: () => ({ publicKey: Buffer.from('0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a') }),
  }),
  LiskLedger: () => ({
    getPubKey: () => ({ publicKey: Buffer.from('0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a') }),
    signTX: () => Buffer.from('68656c6c6f'),
    signMSG: () => Buffer.from('hello'),
  }),
}));

describe('ledger', () => {
  const device = {
    deviceId: `${Math.floor(Math.random() * 1e5) + 1}`,
    productName: LEDGER.name,
    path: '',
    manufacturer: LEDGER.name,
  };
  const data = { index: 0, showOnDevice: true };
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
    // Arrange
    const helloBuff = Buffer.from('hello');
    const helloHex = '68656c6c6f';
    apiClient.transactions.getBytes.mockReturnValue(helloBuff);
    apiClient.cryptography.bufferToHex.mockReturnValue(helloHex);
    // Act
    const signedTrx = await ledger.default.signTransaction(transporter, { device, data });
    // Assert
    expect(signedTrx).to.eql(helloHex);
  });

  it('Should return signed message from ledger device', async () => {
    // Arrange
    const helloHex = '68656c6c6f';
    apiClient.cryptography.bufferToHex.mockReturnValue(helloHex);
    // Act
    const signedMsg = await ledger.default.signMessage(transporter, { device, data });
    // Assert
    expect(signedMsg).to.eql(helloHex);
  });
});
