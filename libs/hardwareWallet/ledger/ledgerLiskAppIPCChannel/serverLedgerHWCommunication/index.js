/* eslint-disable max-statements */
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid';
import { LiskApp } from '@zondax/ledger-lisk';
import { getDevicesFromPaths, getLedgerAccount } from './utils';

export async function getPubKey({ devicePath, accountIndex, showOnDevice }) {
  let transport;
  try {
    transport = await TransportNodeHid.open(devicePath);
    const liskLedger = new LiskApp(transport);
    const ledgerAccount = getLedgerAccount(accountIndex);
    const response = showOnDevice
      ? await liskLedger.showAddressAndPubKey(ledgerAccount.derivePath())
      : await liskLedger.getAddressAndPubKey(ledgerAccount.derivePath());
    await transport?.close();
    if (response?.error_message === 'No errors') {
      return response?.pubKey;
    }
    return Promise.reject(response.return_code);
  } catch (error) {
    await transport?.close();
    return Promise.reject(error);
  }
}

export async function getSignedTransaction({ devicePath, accountIndex, unsignedMessage }) {
  let transport;
  try {
    transport = await TransportNodeHid.open(devicePath);
    const liskLedger = new LiskApp(transport);
    const ledgerAccount = getLedgerAccount(accountIndex);
    const response = await liskLedger.sign(
      ledgerAccount.derivePath(),
      Buffer.from(unsignedMessage, 'hex')
    );
    if (transport && transport.close) await transport.close();
    if (response?.error_message === 'No errors') {
      return response;
    }
    return Promise.reject(response.return_code);
  } catch (error) {
    if (transport && transport.close) await transport.close();
    return Promise.reject(error);
  }
}

export async function getSignedMessage({ devicePath, accountIndex, unsignedMessage }) {
  let transport;
  try {
    transport = await TransportNodeHid.open(devicePath);
    const liskLedger = new LiskApp(transport);
    const ledgerAccount = getLedgerAccount(accountIndex);
    const signature = await liskLedger.signMessage(
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
      const devices = await getDevicesFromPaths(devicePaths);
      return devices;
    }
    return [];
  } catch (error) {
    return Promise.reject(error);
  }
}
