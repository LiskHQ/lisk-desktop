export const setInStorage = (key, value) => {
  const { ipc } = window;
  if (ipc) {
    ipc.send('storeConfig', { key, value });
  } else {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
};

export const getFromStorage = (key, backup, cb) => {
  let info = null;
  const { ipc } = window;
  if (ipc) {
    ipc.on('configRetrieved', (action, data) => {
      info = data[key];
      cb(info || backup);
    });
    ipc.send('retrieveConfig');
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
