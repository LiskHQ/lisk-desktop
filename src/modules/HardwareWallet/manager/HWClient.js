import { CLIENT } from '../consts';

export class HWClient {
  constructor() {
    this.ipc = window.ipc;
  }

  executeCommand(action, payload) {
    return new Promise((resolve, reject) => {
      // Listening for response
      this.ipc.once(`${action}.${CLIENT.RESPONSE}`, (_event, response) => {
        if (response.success) return resolve(response.data);
        return reject(new Error(`${action} failed: ${response.error}`));
      });
      // Requesting data
      this.ipc.send(`${action}.${CLIENT.REQUEST}`, payload);
    });
  }

  subscribe(event, cb) {
    this.ipc.on(event, cb);
  }
}
