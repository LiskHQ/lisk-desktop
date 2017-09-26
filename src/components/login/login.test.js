import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { mount, shallow } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import Lisk from 'lisk-js';
import PropTypes from 'prop-types';
import Login from './login';

describe('Login', () => {
  let wrapper;
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
    context: { store, history },
    childContextTypes: {
      store: PropTypes.object.isRequired,
      history: PropTypes.object.isRequired,
    },
    lifecycleExperimental: true,
  };
  props.spyActivePeerSet = spy(props.activePeerSet);

  describe('Generals', () => {
    beforeEach(() => {
      wrapper = mount(<Router><Login {...props}/></Router>, options);
    });

    it('should show error about passphrase length if passphrase is have wrong length', () => {
      const passphrase = 'recipe bomb asset salon coil symbol tiger engine assist pact pumpkin';
      const expectedError = 'Passphrase should have 12 words, entered passphrase has 11';
      wrapper.find('.passphrase input').simulate('change', { target: { value: ' ' } });
      wrapper.find('.passphrase input').simulate('change', { target: { value: passphrase } });
      expect(wrapper.find('.passphrase').html()).to.contain(expectedError);
    });
  });

  describe('componentDidUpdate', () => {
    const address = 'http:localhost:8080';
    props.account = { address: 'dummy' };

    it('calls this.props.history.replace(\'/main/transactions\')', () => {
      wrapper = shallow(<Router><Login {...props}/></Router>, options);
      wrapper.setProps(props);
      expect(props.history.replace).to.have.been.calledWith('/main/transactions');
    });

    it.skip('calls this.props.history.replace with referrer address', () => {
      wrapper = shallow(<Router><Login {...props}/></Router>, options);
      props.history.replace.reset();
      history.location.search = '?referrer=/main/voting';
      wrapper.setProps({ history });
      expect(props.history.replace).to.have.been.calledWith('/main/voting');
    });

    it.skip('call this.props.history.replace with "/main/transaction" if referrer address is "/main/forging" and account.isDelegate === false', () => {
      history.location.search = '';
      wrapper = shallow(<Router><Login {...props}/></Router>, options);
      history.location.search = '?referrer=/main/forging';
      account.isDelegate = false;
      props.history.replace.reset();
      wrapper.setProps({ history, account });
      expect(props.history.replace).to.have.been.calledWith('/main/transactions');
    });

    it('calls localStorage.setItem(\'address\', address) if this.state.address', () => {
      const spyFn = spy(localStorage, 'setItem');
      wrapper = shallow(<Login {...props}/>, options);
      wrapper.setState({ address });
      wrapper.setProps(props);
      expect(spyFn).to.have.been.calledWith('address', address);

      spyFn.restore();
      localStorage.removeItem('address');
    });
  });

  describe('validateUrl', () => {
    beforeEach('', () => {
      wrapper = shallow(<Login {...props}/>, options);
    });

    it('should set address and addressValidity="" for a valid address', () => {
      const validURL = 'http://localhost:8080';
      const data = wrapper.instance().validateUrl(validURL);
      const expectedData = {
        address: validURL,
        addressValidity: '',
      };
      expect(data).to.deep.equal(expectedData);
    });

    it('should set address and addressValidity correctly event without http', () => {
      const validURL = '127.0.0.1:8080';
      const data = wrapper.instance().validateUrl(validURL);
      const expectedData = {
        address: validURL,
        addressValidity: '',
      };
      expect(data).to.deep.equal(expectedData);
    });

    it('should set address and addressValidity="URL is invalid" for a valid address', () => {
      const validURL = 'http:localhost:8080';
      const data = wrapper.instance().validateUrl(validURL);
      const expectedData = {
        address: validURL,
        addressValidity: 'URL is invalid',
      };
      expect(data).to.deep.equal(expectedData);
    });
  });

  describe('changeHandler', () => {
    it('call setState with matching data', () => {
      wrapper = shallow(<Login {...props}/>, options);
      const key = 'network';
      const value = 0;
      const spyFn = spy(Login.prototype, 'setState');
      wrapper.instance().changeHandler(key, value);
      expect(spyFn).to.have.been.calledWith({ [key]: value });
    });
  });

  describe('onLoginSubmission', () => {
    it.skip('it should call activePeerSet', () => {
      wrapper = shallow(<Login {...props}/>, options);
      wrapper.instance().onLoginSubmission();
      expect(wrapper.props().spyActivePeerSet).to.have.been.calledWith();
    });
  });
});
