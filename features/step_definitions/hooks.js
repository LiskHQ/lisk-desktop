/* eslint-disable import/no-extraneous-dependencies */
const { defineSupportCode } = require('cucumber');
const fs = require('fs');

function writeScreenShot(data, filename) {
  const stream = fs.createWriteStream(filename);
  stream.write(new Buffer(data, 'base64'));
  stream.end();
}

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

defineSupportCode(({ After }) => {
  After((scenario, callback) => {
    if (scenario.isFailed()) {
      const screnarioSlug = slugify([scenario.scenario.feature.name, scenario.scenario.name].join(' '));
      browser.takeScreenshot().then((screenshotBuffer) => {
        if (!fs.existsSync(browser.params.screenshotFolder)) {
          fs.mkdirSync(browser.params.screenshotFolder);
        }
        writeScreenShot(screenshotBuffer, `${browser.params.screenshotFolder}/${screnarioSlug}.png`);
        callback();
      });
    } else {
      callback();
    }
  });
});
