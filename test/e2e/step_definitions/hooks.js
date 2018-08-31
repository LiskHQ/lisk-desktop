/* eslint-disable import/no-extraneous-dependencies */
const { defineSupportCode } = require('cucumber');
const Cucumber = require('cucumber');
const fs = require('fs');
const util = require('util');
const localStorage = require('../support/localStorage.js');
const sessionStorage = require('../support/sessionStorage.js');

const jsonFormatter = new Cucumber.JsonFormatter();

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
  stream.write(new Buffer(data, 'base64')); // eslint-disable-line no-buffer-constructor
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

defineSupportCode(({ Before, After, registerListener }) => {
  Before('@pending', (scenario, callback) => {
    callback(null, 'pending');
  });

  Before((scenario, callback) => {
    browser.ignoreSynchronization = true;
    browser.driver.manage().window()
      .setSize(browser.params.screenWidth, browser.params.screenHeight);
    browser.get(browser.params.baseURL);
    localStorage.clear();

    if (scenario.scenario.feature.name !== 'Login') {
      localStorage.setItem('settings', '{ "showNetwork": true }');
    }

    if (scenario.scenario.feature.name === 'Onboarding') {
      localStorage.setItem('settings', '{ "showNetwork": true, "onBoarding": true }');
    }
    browser.get(browser.params.baseURL).then(callback);
  });

  After((scenario, callback) => {
    localStorage.clear();
    sessionStorage.clear();

    browser.manage().logs().get('browser').then((browserLog) => {
      console.log(`BROWSER LOG: ${util.inspect(browserLog)}`); // eslint-disable-line no-console
    });

    if (scenario.isFailed()) {
      const screnarioSlug = slugify([scenario.scenario.feature.name, scenario.scenario.name].join(' '));
      takeScreenshot(screnarioSlug, callback);
    } else {
      callback();
    }
  });

  jsonFormatter.log = function (string) {
    if (!fs.existsSync(browser.params.reportDir)) {
      fs.mkdirSync(browser.params.reportDir);
    }

    const targetJsonPath = `${browser.params.reportDir}${browser.params.reportFile}`;
    fs.writeFile(targetJsonPath, string, (err) => {
      if (err) {
        console.error('Failed to save cucumber test results to json file.'); // eslint-disable-line no-console
        console.error(err); // eslint-disable-line no-console
      }
    });
  };
  registerListener(jsonFormatter);
});
