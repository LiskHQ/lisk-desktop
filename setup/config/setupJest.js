import React from 'react';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import chaiEnzyme from 'chai-enzyme';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ReactPiwik from 'react-piwik';
import crypto from 'crypto';
import ReactRouterDom from 'react-router-dom';
import * as ReactRedux from 'react-redux';
import lodashMerge from 'lodash.merge';
import defaultState from '../../tests/constants/defaultState';
import { cryptography } from '@liskhq/lisk-client';

require('jest-localstorage-mock');

Enzyme.configure({ adapter: new Adapter() });

chai.use(sinonChai);
chai.use(chaiEnzyme());
chai.use(chaiAsPromised);
sinonStubPromise(sinon);
jest.useFakeTimers();

ReactRouterDom.Link = jest.fn(({ children, to, activeClassName, ...props }) => (
  <a {...props} href={to}>
    {children}
  </a>
));

ReactRouterDom.NavLink = ReactRouterDom.Link;

ReactRedux.connect = jest.fn((mapStateToProps, mapDispatchToProps = {}) => (Component) => {
  function MockConnect(props) {
    return (
      <Component
        {...{
          ...Object.keys(mapDispatchToProps).reduce(
            (acc, key) => ({
              ...acc,
              [key]: jest.fn(),
            }),
            {}
          ),
          ...(typeof mapStateToProps === 'function' ? mapStateToProps(defaultState, props) : {}),
          ...props,
        }}
      />
    );
  }
  return MockConnect;
});

ReactRedux.useSelector = jest.fn((filter) => {
  let result;
  try {
    result = filter(lodashMerge(defaultState, ReactRedux.useStore().getState()));
  } catch (e) {
    result = filter(defaultState);
  }
  return result;
});
ReactRedux.useDispatch = jest.fn(() => () => { });

jest.mock('i18next', () => {
  function t(key, o) {
    return key.replace(/{{([^{}]*)}}/g, (a, b) => {
      const r = o[b];
      return typeof r === 'string' || typeof r === 'number' ? r : a;
    });
  }
  return {
    t,
    changeLanguage: jest.fn(),
    language: 'en',
    init: () => ({
      t,
      language: 'en',
      changeLanguage: jest.fn(),
    }),
  };
});

jest.mock('react-i18next', () => {
  function t(key, o) {
    return key.replace(/{{([^{}]*)}}/g, (a, b) => {
      const r = o[b];
      return typeof r === 'string' || typeof r === 'number' ? r : a;
    });
  }
  return {
    withTranslation: jest.fn(() => (Component) => (props) => (
      <Component
        {...{
          ...props,
          t,
        }}
      />
    )),
    setDefaults: jest.fn(),
    useTranslation: jest.fn(() => ({
      t: (key) => key,
      i18n: {
        t,
        changeLanguage: jest.fn(),
        language: 'en',
        init: () => ({
          t,
          language: 'en',
          changeLanguage: jest.fn(),
        }),
      },
    })),
  };
});

const localStorageMock = (() => {
  let store = {};

  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

Object.defineProperty(window, 'crypto', {
  value: {
    getRandomValues: (arr) => crypto.randomBytes(arr.length),
  },
});

ReactPiwik.push = () => { };
ReactPiwik.trackingEvent = () => { };
sinon.stub(ReactPiwik.prototype, 'connectToHistory').callsFake(() => 1);
sinon.stub(ReactPiwik.prototype, 'initPiwik').callsFake(() => { });

// https://github.com/nkbt/react-copy-to-clipboard/issues/20#issuecomment-414065452
// Polyfill window prompts to always confirm.  Needed for react-copy-to-clipboard to work.
global.prompt = () => true;

// Polyfill text selection functionality.  Needed for react-copy-to-clipboard to work.
// Can remove this once https://github.com/jsdom/jsdom/issues/317 is implemented.
const getSelection = () => ({
  rangeCount: 0,
  addRange: () => { },
  getRangeAt: () => { },
  removeAllRanges: () => { },
});
window.getSelection = getSelection;
document.getSelection = getSelection;

// https://stackoverflow.com/questions/53961469/testing-chart-js-with-jest-enzyme-failed-to-create-chart-cant-acquire-contex
jest.mock('react-chartjs-2', () => ({
  Line: () => null,
  Chart: () => null,
  Doughnut: () => null,
  Bar: () => null,
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json() {
      return Promise.resolve({ data: [], meta: { count: 0, total: 0 } });
    },
  })
);

const privateKey =
  'd92f8ffd3046fa9de33c21cef7af6f1315e289003c19f9b23ce6d499c8641d4e0792fecbbecf6e7370f7a7b217a9d159f380d3ecd0f2760d7a55dd3e27e97184';
const publicKey = '0792fecbbecf6e7370f7a7b217a9d159f380d3ecd0f2760d7a55dd3e27e97184';
const defaultKeys = {
  privateKey: Buffer.from(privateKey, 'hex'),
  publicKey: Buffer.from(publicKey, 'hex'),
};

jest.spyOn(cryptography.utils, 'hash').mockReturnValue('123456789019eac790d89f08e')
// jest.spyOn(cryptography.legacy, 'getKeys').mockReturnValue(defaultKeys)
