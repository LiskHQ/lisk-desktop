import { IPC_MESSAGES, CLIENT } from '@libs/hwServer/constants';

export class HWClient {
  constructor() {
    this.ipc = window.ipc;
  }

  once(event, payload) {
    return new Promise((resolve, reject) => {
      // Listening for response
      this.ipc.once(`${event}.${CLIENT.RESPONSE}`, (_event, response) => {
        if (response.success) return resolve(response.data);
        return reject(new Error(`${event} failed: ${response.error}`));
      });
      // Requesting data
      this.ipc.send(`${event}.${CLIENT.REQUEST}`, payload);
    });
  }

  executeCommand(payload) {
    return this.once(IPC_MESSAGES.HW_COMMAND, payload);
  }

  invoke(payload) {
    return this.once(IPC_MESSAGES.INVOKE, payload);
  }

  subscribe(event, cb) {
    this.ipc?.on(event, cb);
  }
}
