const localStorage = {
  setItem: (key, value) => (
    browser.executeScript(`return window.localStorage.setItem('${key}', '${value}');`)
  ),
  clear: () => (
    browser.executeScript('return window.localStorage.clear();')
  ),
};

module.exports = localStorage;

