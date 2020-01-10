/* eslint-disable import/no-extraneous-dependencies */
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
import { deepMergeObj } from '../src/utils/helpers';
// TODO remove next line after upgrading node version to at least 7
import 'es7-object-polyfill';
import defaultState from '../test/constants/defaultState';

require('jest-localstorage-mock');

Enzyme.configure({ adapter: new Adapter() });

chai.use(sinonChai);
chai.use(chaiEnzyme());
chai.use(chaiAsPromised);
sinonStubPromise(sinon);
// eslint-disable-next-line no-undef
jest.useFakeTimers();

ReactRouterDom.Link = jest.fn(
  // eslint-disable-next-line react/display-name
  ({
    children, to, activeClassName, ...props
  }) => (
    <a {...props} href={to}>{children}</a>
  ),
);

ReactRouterDom.withRouter = jest.fn((Component => (
  // eslint-disable-next-line react/display-name
  props => (
    <Component {...{
      history: {
        push: jest.fn(),
        replace: jest.fn(),
        createHref: jest.fn(),
        listen: jest.fn(() => jest.fn()),
        location: {
          pathname: '/',
        },
      },
      ...props,
    }}
    />
  )
)));
ReactRouterDom.NavLink = ReactRouterDom.Link;


ReactRedux.connect = jest.fn((mapStateToProps, mapDispatchToProps = {}) => ((Component) => {
  function MockConnect(props) {
    return (
      <Component {...{
        ...(Object.keys(mapDispatchToProps).reduce((acc, key) => ({
          ...acc,
          [key]: jest.fn(),
        }), {})
        ),
        ...(typeof mapStateToProps === 'function'
          ? mapStateToProps(defaultState, props)
          : {}
        ),
        ...props,
      }}
      />
    );
  }
  return MockConnect;
}));

ReactRedux.useSelector = jest.fn((filter) => {
  let result;
  try {
    result = filter(deepMergeObj(defaultState, ReactRedux.useStore().getState()));
  } catch (e) {
    result = filter(defaultState);
  }
  return result;
});
ReactRedux.useDispatch = jest.fn(() => () => {});

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
    withTranslation: jest.fn(() => (Component => (
      // eslint-disable-next-line react/display-name
      props => (
        <Component {...{
          ...props,
          t,
        }}
        />
      )
    ))),
    setDefaults: jest.fn(),
    useTranslation: jest.fn(() => ({
      t: key => key,
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
    getItem: key => store[key] || null,
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
    getRandomValues: arr => crypto.randomBytes(arr.length),
  },
});

ReactPiwik.push = () => {};
ReactPiwik.trackingEvent = () => {};
sinon.stub(ReactPiwik.prototype, 'connectToHistory').callsFake(() => 1);
sinon.stub(ReactPiwik.prototype, 'initPiwik').callsFake(() => {});

// https://github.com/nkbt/react-copy-to-clipboard/issues/20#issuecomment-414065452
// Polyfill window prompts to always confirm.  Needed for react-copy-to-clipboard to work.
global.prompt = () => true;

// Polyfill text selection functionality.  Needed for react-copy-to-clipboard to work.
// Can remove this once https://github.com/jsdom/jsdom/issues/317 is implemented.
const getSelection = () => ({
  rangeCount: 0,
  addRange: () => {},
  getRangeAt: () => {},
  removeAllRanges: () => {},
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
