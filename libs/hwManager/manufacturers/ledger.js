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

const getLedgerAccount = () => {
  const ledgerAccount = new LedgerAccount();
  ledgerAccount.coinIndex(SupportedCoin.LISK);
  ledgerAccount.account(0);
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

export default {
  listener,
  checkIfInsideLiskApp,
};
