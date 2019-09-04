/* istanbul ignore file */
/* eslint-disable no-bitwise */
import {
  IPC_MESSAGES,
  MANUFACTURERS,
} from '../../constants';
import {
  getHardenedPath,
  toTrezorGrammar,
} from './utils';


/**
 * addDevice - function - Add a new device to the devices list.
 * @param {object} device - Device object comming from the trezor library
 * @param {function} add - Function that use for main file to include the device in the main list.
 */
const addDevice = (device, { add }) => {
  add({
    deviceId: device.features.device_id,
    label: device.features.label,
    model: device.features.model === '1'
      ? MANUFACTURERS.Trezor.models.Trezor_Model_One
      : MANUFACTURERS.Trezor.models.Trezor_Model_T,
    path: device.originalDescriptor.path,
    manufactor: MANUFACTURERS.Trezor.name,
  });
};

/**
 * removeDevice - funcion - Remove a device from the main list and the device array.
 * @param {object} device - Device object comming from the trezor library
 * @param {function} remove - Function for remove a device from the main list.
 */
const removeDevice = (device, { remove }) => {
  remove(device.originalDescriptor.path);
};

/**
 * listener - function - Always listen for new messages for connect or disconnect devices.
 * @param {object} transport - Library use for handle the trezor devices.
 * @param {object} actions - Contains 2 functions: add and remove.
 * @param {function} actions.add - Function for add a new device to the main list.
 * @param {function} actions.remove - Function for remove a device from the main list.
 */
const listener = (transport, actions) => {
  transport.on(IPC_MESSAGES.CONNECT, (device) => { addDevice(device, actions); });
  transport.on(IPC_MESSAGES.DISCONNECT, (device) => { removeDevice(device, actions); });
  transport.on(IPC_MESSAGES.ERROR, (error) => { throw new Error(error); });
  process.on(IPC_MESSAGES.EXIT, () => { transport.onbeforeunload(); });
};


// TODO after move the logic of each event to separate functions we can remove
const executeCommand = (transporter, {
  device,
  action,
  data,
}) => {
  const trezorDevice = transporter.asArray()
    .find(d => d.features.device_id === device.deviceId);
  if (!trezorDevice) {
    Promise.reject(new Error('DEVICE_IS_NOT_CONNECTED'));
  }

  return new Promise((resolve, reject) => {
    trezorDevice.waitForSessionAndRun(async (session) => {
      try {
        switch (action) {
          case IPC_MESSAGES.GET_PUBLICK_KEY: {
            const { message } = await session.typedCall(
              'LiskGetPublicKey',
              'LiskPublicKey',
              {
                address_n: getHardenedPath(data.index),
                show_display: data.showOnDevice,
              },
            );
            return resolve(message.public_key);
          }

          case IPC_MESSAGES.SIGN_TRANSACTION: {
            const { message } = await session.typedCall(
              'LiskSignTx',
              'LiskSignedTx',
              {
                address_n: getHardenedPath(data.index),
                transaction: toTrezorGrammar(data.tx),
              },
            );
            return resolve(message.signature);
          }

          default: {
            return reject(new Error(`No action created for: ${device.manufactor}.${action}`));
          }
        }
      } catch (err) {
        return reject();
      }
    });
  });
};

export default {
  listener,
  executeCommand,
};
