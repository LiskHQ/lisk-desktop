/* eslint-disable */
import React from 'react';
import LiskHubExtensions from './liskHubExtensions';
import * as Babel from 'babel-standalone';
import { development } from '../constants/env';

const loadRemoteComponent = url => {
  console.log(PRODUCTION, TEST, development, url);
  if (!PRODUCTION && !TEST) {
    fetch(url)
      .then(res => res.text())
      .then(source => {
        let exports = {}
        function require(name) {

          if (name === 'react') return React;
          // else throw `You can't use modules other than "react" in remote component.`
          if (name === 'LiskHubExtensions') return LiskHubExtensions;
        }

        const transformedSource = Babel.transform(source, {
          presets: ['es2015', 'react', 'stage-2'],
        }).code;

        eval(transformedSource);
        return exports.__esModule ? exports.default : exports;
      });
  }
}

export default loadRemoteComponent;
