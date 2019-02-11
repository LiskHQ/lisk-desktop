import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { MemoryRouter as Router } from 'react-router-dom';
import sinon from 'sinon';
import PropTypes from 'prop-types';
import i18n from '../../i18n';
import StatusBar from './statusBar';
import routes from '../../constants/routes';
import accounts from './../../../test/constants/accounts';

describe('ExternalLinks', () => {
  let wrapper;

  const mountWithRouter = (node, options) => mount(<Router>{node}</Router>, options);

  const history = {
    location: { pathname: `${routes.dashboard.path}` },
  };

  const props = {
    t: val => val,
    logOut: () => {},
    autoLogout: true,
    setActiveDialog: () => { },
    resetTimer: sinon.spy(),
    history: {
      replace: sinon.spy(),
    },
    account: {
      address: accounts.genesis.address,
      passphrase: accounts.genesis.passphrase,
      expireTime: 1527755244818,
    },
    location: { pathname: `${routes.explorer.path}${routes.search}` },
    isAuthenticated: false,
    removePassphrase: sinon.spy(),
    peers: {
      liskAPIClient: {},
      options: {
        code: 2,
        nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
      },
      status: {
        online: true,
      },
    },
    showNetworkIndicator: true,
  };

  const options = {
    context: {
      history, i18n, router: { route: history, history },
    },
    childContextTypes: {
      history: PropTypes.object.isRequired,
      i18n: PropTypes.object.isRequired,
      router: PropTypes.object.isRequired,
    },
  };

  beforeEach(() => {
    wrapper = mountWithRouter(<StatusBar {...props} />, options);
  });

  it('renders <StatusBar /> component', () => {
    expect(wrapper.find('.wrapper').at(0)).to.have.length(1);
  });

  it('should reset time after call reset timer function', () => {
    wrapper.find('Countdown').props().onComplete();
    expect(props.history.replace).to.have.been.calledWith(`${routes.loginV2.path}`);
  });

  it('should redirect to dashboard after 10 min', () => {
    wrapper.find('CustomCountDown').props().resetTimer();
    expect(props.resetTimer).to.have.been.calledWith();
  });
});
