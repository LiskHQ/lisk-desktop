/* eslint-disable max-statements */
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid';
import { LiskApp } from '@zondax/ledger-lisk';
import { getDevicesFromPaths, getLedgerAccount } from './utils';

export async function getPubKey({ devicePath, accountIndex }) {
  console.log('getPubKey devicePath, accountIndex', { devicePath, accountIndex });
  let transport = TransportNodeHid;
  try {
    transport = await transport.open(devicePath);
    const liskLedger = new LiskApp(transport);
    const ledgerAccount = getLedgerAccount(accountIndex);
    const account = await liskLedger.getAddressAndPubKey(ledgerAccount.derivePath());
    console.log('getPubKey address', account);
    await transport.close();
    const errorMessage = account?.error_message;
    if (errorMessage === 'No errors') {
      return account?.pubKey;
    }
    return Promise.reject(Error(errorMessage));
  } catch (error) {
    console.log('getAddressAndPubKey error', error);
    await transport?.close();
    return Promise.reject(error);
  }
}

export async function getSignedTransaction({ devicePath, accountIndex, unsignedMessage }) {
  let transport = TransportNodeHid;
  try {
    transport = await transport.open(devicePath);
    const liskLedger = new LiskApp(transport);
    const ledgerAccount = getLedgerAccount(accountIndex);
    const signature = await liskLedger.sign(
      ledgerAccount.derivePath(),
      Buffer.from(unsignedMessage, 'hex')
    );
    console.log('getSignedTransaction signature', signature);
    if (transport && transport.close) await transport.close();
    return signature;
  } catch (error) {
    if (transport && transport.close) await transport.close();
    console.log('getSignedTransaction error', error);
    return Promise.reject(error);
  }
}

export async function getSignedMessage({ devicePath, accountIndex, unsignedMessage }) {
  let transport = TransportNodeHid;
  try {
    transport = await transport.open(devicePath);
    const liskLedger = new LiskApp(transport);
    const ledgerAccount = getLedgerAccount(accountIndex);
    const signature = await liskLedger.sign(
      ledgerAccount.derivePath(),
      Buffer.from(unsignedMessage, 'hex')
    );
    await transport?.close();
    return signature;
  } catch (error) {
    if (transport) await transport.close();
    return Promise.reject(error);
  }
}

export async function getConnectedDevices() {
  try {
    const devicePaths = await TransportNodeHid.list();
    if (devicePaths?.length > 0) {
      const devices = await getDevicesFromPaths(devicePaths, TransportNodeHid);
      return devices;
    }
    return [];
  } catch (error) {
    console.log('getConnectedDevices error', error?.toString());
    // throw new Error(error);
    return Promise.reject(error);
  }
}
