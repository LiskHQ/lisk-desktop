/**
 * This file is use for the exchange messages with the HWManager.
 * The communication message is through IPC (window.ipc)
 */
import { IPC_MESSAGES, RESPONSE, REQUEST } from './constants';

const IPC = window.ipc;

/**
 * executeCommand - Function.
 * Use for send and request data to the HWManager.
 */
const executeCommand = (action, payload) => (
  new Promise((resolve, reject) => {
    // Listening for response
    IPC.once(`${action}.${RESPONSE}`, (event, response) => {
      if (response.success) return resolve(response.data);
      return reject(new Error(`${action} failed: ${response.error}`));
    });
    // Requesting data
    IPC.send(`${action}.${REQUEST}`, payload);
  })
);

/**
 * getPublicKey - Function.
 * Use for get the public key from the device for a specific account(s)
 * @param {object} data -> Object that contain the information about the device and data
 * @param {string} data.deviceId -> Id of the hw device
 * @param {number} data.index -> index of the account of which will extract information
 * @param {boolean} data.showOnDevice -> Boolean value to inform device if show or
 * not information in screen
 */
const getPublicKey = async (data) => {
  const response = await executeCommand(IPC_MESSAGES.HW_COMMAND, {
    action: IPC_MESSAGES.GET_PUBLIC_KEY, data,
  });
  return response;
};

/**
 * getAddress - Function.
 * Use for get the Address from the account
 * @param {object} data -> Object that contain the information about the device and data
 * @param {string} data.deviceId -> Id of the hw device
 * @param {number} data.index -> index of the account of which will extract information
 * @param {boolean} data.showOnDevice -> Boolean value to inform device if show or
 * not information in screen
 */
const getAddress = async (data) => {
  const response = await executeCommand(IPC_MESSAGES.HW_COMMAND, {
    action: IPC_MESSAGES.GET_ADDRESS, data,
  });
  return response;
};

/**
 * signTransaction - Function.
 * Use for sign a transaction, this could be send or vote
 * @param {object} data -> Object that contain the information about the device and data
 * @param {string} data.deviceId -> Id of the hw device
 * @param {number} data.index -> index of the account of which will extract information
 * @param {number} data.networkIdentifier -> lisk network identifier
 * @param {object} data.transactionBytes -> transaction bytes to be signed
 */
const signTransaction = async (data) => {
  const response = await executeCommand(
    IPC_MESSAGES.HW_COMMAND,
    {
      action: IPC_MESSAGES.SIGN_TRANSACTION,
      data,
    },
  );
  return response;
};

/**
 * signMessage - Function.
 * Use for sign a random message
 * @param {object} data -> Object that contain the information about the device and data
 * @param {string} data.deviceId -> Id of the hw device
 * @param {number} data.index -> index of the account of which will extract information
 * @param {object} data.message -> Object with all transaction information
 */
const signMessage = async (data) => {
  const response = await executeCommand(
    IPC_MESSAGES.HW_COMMAND,
    {
      action: IPC_MESSAGES.SIGN_MSG,
      data,
    },
  );
  return response;
};

/**
 * checkIfInsideLiskApp - Function.
 * To check if Lisk App is open on the device
 * @param {object} data -> Object that contain the information about the device and data
 * @param {string} data.id -> Id of the hw device
 */
const checkIfInsideLiskApp = async data => (
  executeCommand(IPC_MESSAGES.CHECK_LEDGER, data)
);

/**
 * subscribeToDeviceConnected - Function.
 * Always listen for get the information of the new connected device
 * @param {function} fn -> callback function
 */
const subscribeToDeviceConnected = (fn) => {
  IPC.on(IPC_MESSAGES.HW_CONNECTED, (event, response) => fn(response));
};

/**
 * subscribeToDeviceDisconnected - Function.
 * Always listen for get the information of the disconnected device
 * @param {function} fn -> callback function
 */
const subscribeToDeviceDisconnected = (fn) => {
  IPC.on(IPC_MESSAGES.HW_DISCONNECTED, (event, response) => fn(response));
};

const getDeviceList = () => (
  executeCommand(IPC_MESSAGES.GET_CONNECTED_DEVICES_LIST, null)
);

/**
 * subscribeToDevicesList - Function.
 * Always listen for any new change on the devices list
 * @param {function} fn -> callback function
 */
const subscribeToDevicesList = (fn) => {
  const updateDevices = async () => {
    const response = await getDeviceList();
    fn(response);
  };
  IPC.on(IPC_MESSAGES.DEVICE_LIST_CHANGED, updateDevices);
  setTimeout(updateDevices, 0);
  return {
    unsubscribe: IPC.removeListener.bind(IPC, IPC_MESSAGES.DEVICE_LIST_CHANGED, fn),
  };
};

const validatePin = async ({ deviceId, pin }) => {
  IPC.send(IPC_MESSAGES.VALIDATE_PIN, { pin });
  const response = await getPublicKey({ index: 0, deviceId });
  if (response) {
    return true;
  }
  throw new Error('Invalid PIN');
};

export {
  executeCommand,
  getPublicKey,
  signTransaction,
  checkIfInsideLiskApp,
  getDeviceList,
  subscribeToDeviceConnected,
  subscribeToDeviceDisconnected,
  subscribeToDevicesList,
  validatePin,
  getAddress,
  signMessage,
};
