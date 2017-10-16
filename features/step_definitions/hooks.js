/* eslint-disable import/no-extraneous-dependencies */
const { defineSupportCode } = require('cucumber');
const { takeScreenshot } = require('../support/util.js');

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
      takeScreenshot(screnarioSlug, callback);
    } else {
      callback();
    }
  });
});
