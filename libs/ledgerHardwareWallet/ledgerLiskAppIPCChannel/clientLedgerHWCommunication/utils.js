import { REQUEST, RESPONSE } from '@libs/ledgerHardwareWallet/constants';

const IPC = window.ipc;

export const executeIPCCommand = (action, data) =>
  new Promise((resolve, reject) => {
    // Listening for response
    IPC.once(`${action}.${RESPONSE}`, (_event, response) => {
      if (response.success) return resolve(response.data);
      return reject(new Error(`${action} failed: ${response.error}`));
    });
    // Requesting data
    IPC.send(`${action}.${REQUEST}`, data);
  });
