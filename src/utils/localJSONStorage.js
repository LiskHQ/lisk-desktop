export const setInStorage = (key, value) => {
  const { ipc } = window;
  if (ipc) {
    ipc.send('storeConfig', { key, value });
    // window.localStorage.setItem(key, JSON.stringify(value));
  }
};

export const getFromStorage = (key, backup, cb) => {
  let info = null;
  try {
    const { ipc } = window;
    ipc.on('configRetrieved', (action, data) => {
      info = data[key];
      cb(info);
    });
    ipc.send('retrieveConfig', { key });
  } catch (e) {
    cb(backup);
  }
};

export const removeStorage = (key) => {
  window.localStorage.removeItem(key);
};
