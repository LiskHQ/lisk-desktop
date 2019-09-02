/* istanbul ignore file */
import { LedgerAccount, SupportedCoin, DposLedger } from 'dpos-ledger-api';

let devices = [];
const clearDevices = async (transport, { remove }) => {
  const connectedPaths = await transport.list();
  devices
    .filter(device => !connectedPaths.includes(device))
    .forEach(device => remove(device));
  devices = devices.filter(device => connectedPaths.includes(device));
};

const listener = (transport, actions) => {
  try {
    transport.listen({
      next: ({ type, deviceModel, descriptor }) => {
        if (deviceModel && descriptor) {
          if (type === 'add') {
            devices.push(descriptor);
            actions.add({
              deviceId: `${Math.floor(Math.random() * 1e5) + 1}`,
              label: deviceModel.productName,
              model: deviceModel.productName,
              path: descriptor,
              manufactor: 'ledger',
            });
          }
          clearDevices(transport, actions);
        }
      },
    });
  } catch (e) {
    throw e;
  }
};

const getLedgerAccount = (index = 0) => {
  const ledgerAccount = new LedgerAccount();
  ledgerAccount.coinIndex(SupportedCoin.LISK);
  ledgerAccount.account(index);
  return ledgerAccount;
};

const checkIfInsideLiskApp = async ({
  transporter,
  device,
}) => {
  let transport;
  try {
    transport = await transporter.open(device.path);
    const liskLedger = new DposLedger(transport);
    const ledgerAccount = getLedgerAccount();
    const account = await liskLedger.getPubKey(ledgerAccount);
    device.openApp = !!account;
  } catch (e) {
    device.openApp = false;
  }
  if (transport) transport.close();
  return device;
};

const executeCommand = async (transporter, {
  device,
  action,
  data,
}) => {
  const transport = await transporter.open(device.path);
  const liskLedger = new DposLedger(transport);
  const ledgerAccount = getLedgerAccount(data.index);

  switch (action) {
    case 'GET_PUBLICKEY': {
      const { publicKey: res } = await liskLedger.getPubKey(ledgerAccount, data.showOnDevice);
      transport.close();
      return res;
    }
    default: {
      // eslint-disable-next-line no-console
      console.log(`No action created for: ${device.manufactor}.${action}`);
      return null;
    }
  }
};

export default {
  listener,
  checkIfInsideLiskApp,
  executeCommand,
};
