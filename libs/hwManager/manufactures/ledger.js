
/**
 * DEIVCES
 */

const listener = () => {
  console.log('Listen for LEDGER connect/disconnect devices');
};

const getConnectedDevices = () => {
  console.log('return LEDGER devices list.');
  return [];
};

const getDeviceById = (id) => {
  console.log('Return LEDGER specific device by id', id);
  return '';
};

/**
 * COMMANDS
 */

const getPublicKey = ({ name, id, data }) => {
  console.log('get public key LEDGER', name, id, data);
};

const getAddress = ({ id, data }) => {
  console.log('get address LEDGER', id, data);
};

const getAccounts = ({ name, id, data }) => {
  console.log('get accounts LEDGER', name, id, data);
};

const signInTransaction = ({ name, id, data }) => {
  console.log('sign in trasaction LEDGER', name, id, data);
};

const signInMessage = ({ name, id, data }) => {
  console.log('sign in message LEDGER', name, id, data);
};

const checkStatus = ({ name, id }) => {
  console.log('check status LEDGER', name, id);
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
