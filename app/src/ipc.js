const {
  contextBridge,
  ipcRenderer,
} = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'ipc', {
    send: (channel, data) => {
      // whitelist channels
      let validChannels = ["toMain"];
      if (validChannels.includes(channel)) {
          ipcRenderer.send(channel, data);
      }
    },
    on: (channel, func) => {
      ipcRenderer.on(channel, (event, ...args) => {
		  func(event, ...args);
      });
    },
  },
);
