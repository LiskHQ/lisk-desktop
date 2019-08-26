
/**
 * DEIVCES
 */

const listener = () => {
  console.log('Listen for TREZOR connect/disconnect devices');
};

const getConnectedDevices = () => {
  console.log('return TREZOR devices list.');
  return [];
};

const getDeviceById = (id) => {
  console.log('Return TREZOR specific device by id', id);
  return '';
};

/**
 * COMMANDS
 */

const getPublicKey = ({ name, id, data }) => {
  console.log('get public key TREZOR', name, id, data);
};

const getAddress = ({ name, id, data }) => {
  console.log('get address TREZOR', name, id, data);
};

const getAccounts = ({ name, id, data }) => {
  console.log('get accounts TREZOR', name, id, data);
};

const signInTransaction = ({ name, id, data }) => {
  console.log('sign in trasaction TREZOR', name, id, data);
};

const signInMessage = ({ name, id, data }) => {
  console.log('sign in message TREZOR', name, id, data);
};

const checkStatus = ({ name, id }) => {
  console.log('check status TREZOR', name, id);
};

export default {
  checkStatus,
  listener,
  getAccounts,
  getAddress,
  getConnectedDevices,
  getDeviceById,
  getPublicKey,
  signInMessage,
  signInTransaction,
};
