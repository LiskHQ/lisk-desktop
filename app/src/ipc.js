const { contextBridge, ipcRenderer } = require('electron');

/*
  Hardware wallet IPC channels
  These const need to be the same as in ../../libs/hardwareWallet/ledger/constants
  For security reasons (sandboxing) we cannot import them in this preload script
*/
const REQUEST = 'REQUEST';
const RESPONSE = 'RESPONSE';
const GET_SIGNED_MESSAGE = 'GET_SIGNED_MESSAGE';
const GET_SIGNED_RAW_MESSAGE = 'GET_SIGNED_RAW_MESSAGE';
const GET_SIGNED_TRANSACTION = 'GET_SIGNED_TRANSACTION';
const GET_PUB_KEY = 'GET_PUB_KEY';
const GET_MULTIPLE_ADDRESSES = 'GET_MULTIPLE_ADDRESSES';
const RESET_LEDGER_IPC_QUEUE = 'RESET_LEDGER_IPC_QUEUE';
const GET_CONNECTED_DEVICES = 'GET_CONNECTED_DEVICES';
const LEDGER_HW_HID_EVENT = 'LEDGER_HW_HID_EVENT';
/*
  END Hardware wallet IPC channels
*/

/*
  Global IPC channels
  These const need to be the same as in .src/const/ipcGlobal
  For security reasons (sandboxing) we cannot import them in this preload script
*/
const IPC_UPDATE_AVAILABLE = 'IPC_UPDATE_AVAILABLE';
const IPC_UPDATE_STARTED = 'IPC_UPDATE_STARTED';
const IPC_DOWNLOAD_UPDATE_START = 'IPC_DOWNLOAD_UPDATE_START';
const IPC_DOWNLOAD_UPDATE_PROGRESS = 'IPC_DOWNLOAD_UPDATE_PROGRESS';
const IPC_DOWNLOAD_UPDATE_COMPLETED = 'IPC_DOWNLOAD_UPDATE_COMPLETED';
const IPC_UPDATE_QUIT_AND_INSTALL = 'IPC_UPDATE_QUIT_AND_INSTALL';
const IPC_OPEN_URL = 'IPC_OPEN_URL';
const IPC_RELOAD_URL = 'IPC_RELOAD_URL';
const IPC_STORE_CONFIG = 'IPC_STORE_CONFIG';
const IPC_CONFIG_RETRIEVED = 'IPC_CONFIG_RETRIEVED';
const IPC_RETRIEVE_CONFIG = 'IPC_RETRIEVE_CONFIG';
const IPC_SET_LOCALE = 'IPC_SET_LOCALE';
const IPC_DETECT_LOCALE = 'IPC_DETECT_LOCALE';
/*
  END Global IPC channels
*/

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('ipc', {
  [`${GET_CONNECTED_DEVICES}.${REQUEST}`]: (title) => {
    ipcRenderer.send(`${GET_CONNECTED_DEVICES}.${REQUEST}`, title);
  },
  [`${RESET_LEDGER_IPC_QUEUE}.${REQUEST}`]: (title) => {
    ipcRenderer.send(`${RESET_LEDGER_IPC_QUEUE}.${REQUEST}`, title);
  },
  [`${GET_SIGNED_TRANSACTION}.${REQUEST}`]: (title) => {
    ipcRenderer.send(`${GET_SIGNED_TRANSACTION}.${REQUEST}`, title);
  },
  [`${GET_PUB_KEY}.${REQUEST}`]: (title) => {
    ipcRenderer.send(`${GET_PUB_KEY}.${REQUEST}`, title);
  },
  [`${GET_MULTIPLE_ADDRESSES}.${REQUEST}`]: (title) => {
    ipcRenderer.send(`${GET_MULTIPLE_ADDRESSES}.${REQUEST}`, title);
  },
  [`${GET_SIGNED_MESSAGE}.${REQUEST}`]: (title) => {
    ipcRenderer.send(`${GET_SIGNED_MESSAGE}.${REQUEST}`, title);
  },
  [`${GET_SIGNED_RAW_MESSAGE}.${REQUEST}`]: (title) => {
    ipcRenderer.send(`${GET_SIGNED_RAW_MESSAGE}.${REQUEST}`, title);
  },
  [`${GET_CONNECTED_DEVICES}.${RESPONSE}`]: (func) => {
    ipcRenderer.once(`${GET_CONNECTED_DEVICES}.${RESPONSE}`, (event, ...args) => {
      func(event, ...args);
    });
  },
  [`${RESET_LEDGER_IPC_QUEUE}.${RESPONSE}`]: (func) => {
    ipcRenderer.once(`${RESET_LEDGER_IPC_QUEUE}.${RESPONSE}`, (event, ...args) => {
      func(event, ...args);
    });
  },
  [`${GET_SIGNED_TRANSACTION}.${RESPONSE}`]: (func) => {
    ipcRenderer.once(`${GET_SIGNED_TRANSACTION}.${RESPONSE}`, (event, ...args) => {
      func(event, ...args);
    });
  },
  [`${GET_PUB_KEY}.${RESPONSE}`]: (func) => {
    ipcRenderer.once(`${GET_PUB_KEY}.${RESPONSE}`, (event, ...args) => {
      func(event, ...args);
    });
  },
  [`${GET_MULTIPLE_ADDRESSES}.${RESPONSE}`]: (func) => {
    ipcRenderer.once(`${GET_MULTIPLE_ADDRESSES}.${RESPONSE}`, (event, ...args) => {
      func(event, ...args);
    });
  },
  [`${GET_SIGNED_MESSAGE}.${RESPONSE}`]: (func) => {
    ipcRenderer.once(`${GET_SIGNED_MESSAGE}.${RESPONSE}`, (event, ...args) => {
      func(event, ...args);
    });
  },
  [`${GET_SIGNED_RAW_MESSAGE}.${RESPONSE}`]: (func) => {
    ipcRenderer.once(`${GET_SIGNED_RAW_MESSAGE}.${RESPONSE}`, (event, ...args) => {
      func(event, ...args);
    });
  },
  [LEDGER_HW_HID_EVENT]: (func) => {
    ipcRenderer.on(LEDGER_HW_HID_EVENT, (event, ...args) => {
      func(event, ...args);
    });
  },

  [IPC_UPDATE_AVAILABLE]: (func) => {
    ipcRenderer.on(IPC_UPDATE_AVAILABLE, (event, ...args) => {
      func(event, ...args);
    });
  },
  [IPC_DOWNLOAD_UPDATE_START]: (func) => {
    ipcRenderer.on(IPC_DOWNLOAD_UPDATE_START, (event, ...args) => {
      func(event, ...args);
    });
  },
  [IPC_DOWNLOAD_UPDATE_PROGRESS]: (func) => {
    ipcRenderer.on(IPC_DOWNLOAD_UPDATE_PROGRESS, (event, ...args) => {
      func(event, ...args);
    });
  },
  [IPC_DOWNLOAD_UPDATE_COMPLETED]: (func) => {
    ipcRenderer.on(IPC_DOWNLOAD_UPDATE_COMPLETED, (event, ...args) => {
      func(event, ...args);
    });
  },
  [IPC_OPEN_URL]: (func) => {
    ipcRenderer.on(IPC_OPEN_URL, (event, ...args) => {
      func(event, ...args);
    });
  },
  [IPC_RELOAD_URL]: () => {
    ipcRenderer.send(IPC_RELOAD_URL);
  },
  [IPC_CONFIG_RETRIEVED]: (func) => {
    ipcRenderer.on(IPC_CONFIG_RETRIEVED, (event, ...args) => {
      func(event, ...args);
    });
  },
  [IPC_DETECT_LOCALE]: (func) => {
    ipcRenderer.on(IPC_DETECT_LOCALE, (event, ...args) => {
      func(event, ...args);
    });
  },
  [IPC_UPDATE_STARTED]: (title) => {
    ipcRenderer.send(IPC_UPDATE_STARTED, title);
  },
  [IPC_SET_LOCALE]: (title) => {
    ipcRenderer.send(IPC_SET_LOCALE, title);
  },
  [IPC_RETRIEVE_CONFIG]: (title) => {
    ipcRenderer.send(IPC_RETRIEVE_CONFIG, title);
  },
  [IPC_STORE_CONFIG]: (title) => {
    ipcRenderer.send(IPC_STORE_CONFIG, title);
  },
  [IPC_UPDATE_QUIT_AND_INSTALL]: (title) => {
    ipcRenderer.send(IPC_UPDATE_QUIT_AND_INSTALL, title);
  },
});
