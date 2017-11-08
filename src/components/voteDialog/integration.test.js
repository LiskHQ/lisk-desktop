import React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { step } from 'mocha-steps';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import thunk from 'redux-thunk';
// import Lisk from 'lisk-js';
import actionTypes from '../../constants/actions';
import i18n from '../../i18n'; // initialized i18next instance
import accountReducer from '../../store/reducers/account';
import votingReducer from '../../store/reducers/voting';
import peersReducer from '../../store/reducers/peers';
import { accountLoggedIn } from '../../actions/account';
import { delegatesAdded } from '../../actions/voting';
import * as delegateApi from '../../utils/api/delegate';
// import { activePeerSet } from '../../actions/peers';
import VoteDialog from './index';

const App = combineReducers({
  account: accountReducer,
  voting: votingReducer,
  peers: peersReducer,
});

// const votes = {
//   username1: { publicKey: 'sample_key', confirmed: true, unconfirmed: false },
//   username2: { publicKey: 'sample_key', confirmed: false, unconfirmed: true },
// };
const delegates = [
  { username: 'username1', publicKey: '123HG3452245L' },
  { username: 'username2', publicKey: '123HG3522345L' },
];
const unvotedDelegate = [
  { username: 'username3', publicKey: '123HG3522445L' },
  { username: 'username4', publicKey: '123HG3522545L' },
];

const keyCodes = {
  arrowDown: 40,
  arrowUp: 38,
  enter: 13,
  escape: 27,
};

const store = createStore(App, applyMiddleware(thunk));

describe.only('@integration test', () => {
  const realAccount = {
    address: '16313739661670634666L',
    balance: '346215336704',
    delegate: {},
    multisignatures: [],
    passphrase: 'wagon stock borrow episode laundry kitten salute link globe zero feed marble',
    publicKey: 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f',
    u_multisignatures: [],
    unconfirmedBalance: '0',
  };

  const peers = {
    defaultPeers: [
      'node01.lisk.io',
      'node02.lisk.io',
    ],
    defaultSSLPeers: [
      'node01.lisk.io',
      'node02.lisk.io',
    ],
    defaultTestnetPeers: [
      'testnet.lisk.io',
    ],
    options: {
      name: 'Testnet',
      testnet: true,
      ssl: true,
      port: 443,
      code: 1,
    },
    ssl: true,
    randomPeer: true,
    testnet: true,
    bannedPeers: [],
    currentPeer: 'testnet.lisk.io',
    port: 443,
    nethash: {
      'Content-Type': 'application/json',
      nethash: 'da3ed6a45429278bac2666961289ca17ad86595d33b31037615d4b8e8f158bba',
      broadhash: 'da3ed6a45429278bac2666961289ca17ad86595d33b31037615d4b8e8f158bba',
      os: 'lisk-js-api',
      version: '1.0.0',
      minVersion: '>=0.5.0',
      port: 443,
    },
  };

  const renderWithRouter = Component =>
    <Provider store={ store }>
      <Router>
        <I18nextProvider i18n={ i18n }>
          <Component />
        </I18nextProvider>
      </Router>
    </Provider>;

  store.dispatch(accountLoggedIn(realAccount));
  store.dispatch({
    data: peers,
    type: actionTypes.activePeerSet,
  });
  const component = renderWithRouter(VoteDialog);
  const wrapper = mount(component);


  const clock = sinon.useFakeTimers({
    toFake: ['setTimeout', 'clearTimeout', 'Date'],
  });

  step('should account exist in store', () => {
    expect(store.getState().account).to.be.an('Object');
    expect(store.getState().voting).to.be.an('Object');
    expect(store.getState().peers).to.be.an('Object');
  });

  step('Should confirm button be disable', () => {
    expect(wrapper.find('.primary-button button').props().disabled).to.be.equal(true);
  });

  step('Should confirm button be enabled', () => {
    store.dispatch(delegatesAdded({
      list: delegates,
      totalDelegates: 100,
      refresh: true,
    }));
    expect(store.getState().voting.refresh).to.be.equal(true);
    wrapper.update();
    const voteAutocompleteApiStub = sinon.stub(delegateApi, 'voteAutocomplete');
    voteAutocompleteApiStub.returnsPromise().resolves(unvotedDelegate);
    // write a username
    wrapper.find('.votedListSearch.vote-auto-complete input').simulate('change', { target: { value: 'user' } });
    clock.tick(400);

    // select it with arrow down
    wrapper.find('.votedListSearch.vote-auto-complete input').simulate('keyDown', { keyCode: keyCodes.arrowDown });
    clock.tick(200);
    wrapper.find('.votedListSearch.vote-auto-complete input').simulate('keyDown', { keyCode: keyCodes.enter });
    wrapper.update();
    expect(wrapper.find('.primary-button button').props().disabled).to.be.equal(false);
  });
});
