export default {
  set(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
  },

  get(key, backup) {
    try {
      return JSON.parse(window.localStorage.getItem(key)) || backup;
    } catch (e) {
      return backup;
    }
  },

  remove(key) {
    window.localStorage.removeItem(key);
  },
};
