import vendor from './all';

const devicesListener = () => {
  vendor.ledger.listener();
  vendor.trezor.listener();
};

const getConnectedDevices = () => {
  const ledger = vendor.ledger.getConnectedDevices();
  const trezor = vendor.trezor.getConnectedDevices();
  return [...ledger, ...trezor];
};

const getDeviceById = (name, id) => vendor[name].getDeviceById(id);

const getPublicKey = ({ name, id, data }) => vendor[name].getPublicKey(id, data);

const getAddress = ({ name, id, data }) => vendor[name].getAddress(id, data);

const getAccounts = ({ name, id, data }) => vendor[name].getAccounts(id, data);

const signInTransaction = ({ name, id, data }) => vendor[name].signInTransaction(id, data);

const signInMessage = ({ name, id, data }) => vendor[name].signInMessage(id, data);

const checkStatus = ({ name, id }) => vendor[name].checkStatus(id);

export default {
  checkStatus,
  devicesListener,
  getAccounts,
  getAddress,
  getConnectedDevices,
  getDeviceById,
  getPublicKey,
  signInMessage,
  signInTransaction,
};
