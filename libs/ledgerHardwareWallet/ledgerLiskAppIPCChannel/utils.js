import { REQUEST, RESPONSE } from '@libs/ledgerHardwareWallet/constants';
import { to } from 'await-to-js';
import { ipcMain } from 'electron';

export const createIpcMainChannel = (channelName, callback) => {
  ipcMain.on(`${channelName}.${REQUEST}`, async (event, ...args) => {
    const [error, data] = await to(callback(...args));
    event.sender.send(`${channelName}.${RESPONSE}`, {
      success: !error,
      data,
      error: error?.toString(),
    });
  });
};

export async function getSequentiallyQueuedData(queue, queueId, callBack) {
  await queue.wait(queueId);
  let result;
  try {
    result = await callBack();
  } catch (error) {
    console.error('createIpcMainChannel NAME_SIGN error', { queueId, error });
    result = Promise.reject(error);
  } finally {
    console.log('createIpcMainChannel NAME_SIGN result', { queueId, result });
    queue.end(queueId);
  }
  return result;
}
