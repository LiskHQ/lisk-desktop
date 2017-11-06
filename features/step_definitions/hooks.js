/* eslint-disable import/no-extraneous-dependencies */
const { defineSupportCode } = require('cucumber');
const fs = require('fs');
const localStorage = require('../support/localStorage.js');

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

function writeScreenShot(data, filename) {
  const stream = fs.createWriteStream(filename);
  stream.write(new Buffer(data, 'base64'));
  stream.end();
}

function takeScreenshot(screnarioSlug, callback) {
  browser.takeScreenshot().then((screenshotBuffer) => {
    if (!fs.existsSync(browser.params.screenshotFolder)) {
      fs.mkdirSync(browser.params.screenshotFolder);
    }
    const screenshotPath = `${browser.params.screenshotFolder}/${screnarioSlug}.png`;
    writeScreenShot(screenshotBuffer, screenshotPath);
    console.log(`Screenshot saved to ${screenshotPath}`); // eslint-disable-line no-console
    if (callback) {
      callback();
    }
  });
}

const getNetworkType = (browser) => {
  if (browser.params.testnetCustomNode) return 'customTestnet';
  if (browser.params.testnet) return 'testnet';

  return 'custom';
};
const setNetwork = {
  custom: () => { localStorage.setItem('network', 2); },
  testnet: () => { localStorage.setItem('network', 1); },
  customTestnet: () => {
    localStorage.setItem('address', 'https://testnet.lisk.io');
    localStorage.setItem('network', 2);
  },
};

defineSupportCode(({ Before, After }) => {
  Before((scenario, callback) => {
    browser.ignoreSynchronization = true;
    browser.driver.manage().window().setSize(1000, 1000);
    browser.get(browser.params.baseURL);
    localStorage.clear();
    localStorage.setItem('address', browser.params.liskCoreURL);
    setNetwork[getNetworkType(browser)]();
    callback();
  });

  Before('@pending', (scenario, callback) => {
    callback(null, 'pending');
  });

  After((scenario, callback) => {
    if (scenario.isFailed()) {
      const screnarioSlug = slugify([scenario.scenario.feature.name, scenario.scenario.name].join(' '));
      takeScreenshot(screnarioSlug, callback);
    } else {
      callback();
    }
  });
});
