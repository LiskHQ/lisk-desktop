import { IPC_CONFIG_RETRIEVED, IPC_RETRIEVE_CONFIG, IPC_STORE_CONFIG } from 'src/const/ipcGlobal';

export const setInStorage = (key, value) => {
  const { ipc } = window;
  if (ipc) {
    ipc[IPC_STORE_CONFIG]({ key, value });
  } else {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
};

export const getFromStorage = (key, backup, cb) => {
  let info = null;
  const { ipc } = window;
  if (ipc) {
    ipc[IPC_CONFIG_RETRIEVED]((_, data) => {
      info = data[key];
      cb(info || backup);
    });
    ipc[IPC_RETRIEVE_CONFIG]();
  } else {
    try {
      const value = JSON.parse(window.localStorage.getItem(key));
      cb(value);
    } catch (e) {
      cb(backup);
    }
  }
};

export const removeStorage = (key) => {
  window.localStorage.removeItem(key);
};
