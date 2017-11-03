import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { mount, shallow } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import Lisk from 'lisk-js';
import PropTypes from 'prop-types';
import i18n from '../../i18n';
import Login from './login';

describe('Login', () => {
  let wrapper;
  const address = 'http:localhost:8080';
  const passphrase = 'recipe bomb asset salon coil symbol tiger engine assist pact pumpkin';
  // Mocking store
  const account = {
    isDelegate: false,
    address: '16313739661670634666L',
    username: 'lisk-nano',
  };
  const peers = { data: {} };
  const store = configureMockStore([])({
    peers,
    account,
    activePeerSet: () => {},
  });
  const history = {
    location: {
      pathname: '',
      search: '',
    },
    replace: spy(),
  };
  const props = {
    peers,
    account,
    history,
    accountsRetrieved: spy(),
    t: data => data,
    onAccountUpdated: () => {},
    setActiveDialog: spy(),
    activePeerSet: (network) => {
      props.peers.data = Lisk.api(network);
    },
  };
  const options = {
    context: { store, history, i18n },
    childContextTypes: {
      store: PropTypes.object.isRequired,
      history: PropTypes.object.isRequired,
      i18n: PropTypes.object.isRequired,
    },
    lifecycleExperimental: true,
  };

  describe('Generals', () => {
    beforeEach(() => {
      wrapper = mount(<Router><Login {...props}/></Router>, options);
    });

    it('should show error about passphrase length if passphrase is have wrong length', () => {
      const expectedError = 'Passphrase should have 12 words, entered passphrase has 11';
      wrapper.find('.passphrase input').simulate('change', { target: { value: ' ' } });
      wrapper.find('.passphrase input').simulate('change', { target: { value: passphrase } });
      expect(wrapper.find('.passphrase')).to.contain(expectedError);
    });
  });

  describe('History management', () => {
    props.account = { address: 'dummy' };

    it('calls this.props.history.replace(\'/main/transactions\')', () => {
      wrapper = shallow(<Login {...props}/>, options);
      wrapper.setProps(props);
      expect(props.history.replace).to.have.been.calledWith('/main/transactions');
    });

    it('calls this.props.history.replace with referrer address', () => {
      wrapper = shallow(<Login {...props}/>, options);
      props.history.replace.reset();
      history.location.search = '?referrer=/main/voting';
      wrapper.setProps({ history });
      expect(props.history.replace).to.have.been.calledWith('/main/voting');
    });

    it('call this.props.history.replace with "/main/transaction" if referrer address is "/main/forging" and account.isDelegate === false', () => {
      history.location.search = '';
      wrapper = shallow(<Login {...props}/>, options);
      history.location.search = '?referrer=/main/forging';
      account.isDelegate = false;
      props.history.replace.reset();
      wrapper.setProps({ history, account });
      expect(props.history.replace).to.have.been.calledWith('/main/transactions');
    });

    it('calls localStorage.setItem(\'address\', address) if this.state.address', () => {
      const spyFn = spy(localStorage, 'setItem');
      wrapper = mount(<Router><Login {...props}/></Router>, options);
      // set the network dropdown
      wrapper.find('div.network').simulate('click');
      // select custom node
      wrapper.find('div.network ul li').at(2).simulate('click');
      // fill the address
      wrapper.find('Input.address input').simulate('change', { target: { value: address } });
      wrapper.setProps(props);
      expect(spyFn).to.have.been.calledWith('address', address);

      spyFn.restore();
      localStorage.removeItem('address');
    });
  });

  describe('After submission', () => {
    it('it should call activePeerSet', () => {
      const spyActivePeerSet = spy(props, 'activePeerSet');

      wrapper = mount(<Router><Login {...props}/></Router>, options);
      // Filling the login form
      wrapper.find('div.network').simulate('click');
      wrapper.find('div.network ul li').at(2).simulate('click');
      wrapper.find('Input.address input').simulate('change', { target: { value: address } });
      wrapper.find('Input.passphrase input').simulate('change', { target: { value: passphrase } });
      wrapper.find('form').simulate('submit');
      expect(spyActivePeerSet).to.have.been.calledWith();
    });
  });
});
