/* eslint-disable import/no-extraneous-dependencies */
const { defineSupportCode } = require('cucumber');
const { takeScreenshot, slugify } = require('../support/util.js');

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
