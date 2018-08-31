const sessionStorage = {
  clear: () => (
    browser.executeScript('return window.sessionStorage.clear();')
  ),
};

module.exports = sessionStorage;

