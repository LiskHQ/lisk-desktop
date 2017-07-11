import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import App from './components/app';
import store from './store';
import { setActivePeer } from './utils/api/peers';
import Metronome from './utils/metronome';
import { accountUpdated } from './actions/account';

// temporarily hard-coded
const network = {
  address: 'http://localhost:4000',
  testnet: true,
  nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
};

const accountInfo = {
  account: {
    isDelegate: false,
    address: '16313739661670634666L',
    username: 'lisk-nano',
  },
  address: '16313739661670634666L',
  peers: {
    online: true,
    active: {
      currentPeer: 'localhost',
      port: 4000,
      options: {
        name: 'Custom Node',
      },
    },
  },
  balance: '99992689.6',
};

class Provider extends React.Component {
  constructor() {
    super();
    // temporarily
    store.dispatch(accountUpdated(accountInfo));
    setActivePeer(store, network);
  }

  componentDidMount() {
    // start dispatching sync ticks
    this.metronome = new Metronome();
    this.metronome.init();
  }

  getChildContext() {
    return {
      store: this.props.store,
    };
  }
  render() {
    return this.props.children;
  }
}

Provider.childContextTypes = {
  store: PropTypes.object,
};

const rootElement = document.getElementById('app');

ReactDOM.render(
  <Provider store={store}>
    <App store={store} />
  </Provider>
  , rootElement);

if (module.hot) {
  module.hot.accept('./components/app', () => {
    const NextRootContainer = require('./components/app').default;
    ReactDOM.render(
      <Provider store={store}>
        <NextRootContainer store={store} />
      </Provider>
      , rootElement);
  });
}
