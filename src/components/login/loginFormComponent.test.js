import React from 'react';
import PropTypes from 'prop-types';
import chai, { expect } from 'chai';
import { spy } from 'sinon';
import sinonChai from 'sinon-chai';
import { mount, shallow } from 'enzyme';
import Lisk from 'lisk-js';
import LoginFormComponent from './loginFormComponent';

chai.use(sinonChai);

describe('LoginFormComponent', () => {
  // Mocking store
  const peers = {};
  const account = {
    isDelegate: false,
    address: '16313739661670634666L',
    username: 'lisk-nano',
  };

  const store = {
    dispatch: () => {},
    subscribe: () => {},
    getState: () => ({
      peers,
      account,
    }),
    history: [],
    onAccountUpdated: () => {},
    activePeerSet: (network) => {
      store.peers = {};
      store.peers.data = Lisk.api(network);
    },
  };
  store.spyActivePeerSet = spy(store.activePeerSet);

  const options = {
    context: { store },
    childContextTypes: { store: PropTypes.object.isRequired },
  };

  it('should render a form tag', () => {
    const wrapper = mount(<LoginFormComponent />, options);
    expect(wrapper.find('form')).to.not.equal(undefined);
  });

  describe('componentDidMount', () => {
    it('calls devPreFill', () => {
      const spyFn = spy(LoginFormComponent.prototype, 'devPreFill');
      mount(<LoginFormComponent />, options);
      expect(spyFn).to.have.been.calledWith();
    });
  });

  describe('validateUrl', () => {
    it('should set address and addressValidity="" for a valid address', () => {
      const validURL = 'http://localhost:8080';
      const wrapper = shallow(<LoginFormComponent />, options);
      const data = wrapper.instance().validateUrl(validURL);
      const expectedData = {
        address: validURL,
        addressValidity: '',
      };
      expect(data).to.deep.equal(expectedData);
    });

    it('should set address and addressValidity correctly event without http', () => {
      const validURL = '127.0.0.1:8080';
      const wrapper = shallow(<LoginFormComponent />, options);
      const data = wrapper.instance().validateUrl(validURL);
      const expectedData = {
        address: validURL,
        addressValidity: '',
      };
      expect(data).to.deep.equal(expectedData);
    });

    it('should set address and addressValidity="URL is invalid" for a valid address', () => {
      const validURL = 'http:localhost:8080';
      const wrapper = shallow(<LoginFormComponent />, options);
      const data = wrapper.instance().validateUrl(validURL);
      const expectedData = {
        address: validURL,
        addressValidity: 'URL is invalid',
      };
      expect(data).to.deep.equal(expectedData);
    });
  });

  describe.skip('validatePassphrase', () => {
    it('should set passphraseValidity="" for a valid passphrase', () => {
      const passphrase = 'wagon stock borrow episode laundry kitten salute link globe zero feed marble';
      const wrapper = shallow(<LoginFormComponent />, options);
      const data = wrapper.instance().validatePassphrase(passphrase);
      const expectedData = {
        passphrase,
        passphraseValidity: '',
      };
      expect(data).to.deep.equal(expectedData);
    });

    it('should set passphraseValidity="Empty passphrase" for an empty string', () => {
      const passphrase = '';
      const wrapper = shallow(<LoginFormComponent />, options);
      const data = wrapper.instance().validatePassphrase(passphrase);
      const expectedData = {
        passphrase,
        passphraseValidity: 'Empty passphrase',
      };
      expect(data).to.deep.equal(expectedData);
    });

    it('should set passphraseValidity="Invalid passphrase" for a non-empty invalid passphrase', () => {
      const passphrase = 'invalid passphrase';
      const wrapper = shallow(<LoginFormComponent />, options);
      const data = wrapper.instance().validatePassphrase(passphrase);
      const expectedData = {
        passphrase,
        passphraseValidity: 'URL is invalid',
      };
      expect(data).to.deep.equal(expectedData);
    });
  });

  describe('changeHandler', () => {
    it('call setState with matching data', () => {
      const wrapper = shallow(<LoginFormComponent />, options);
      const key = 'address';
      const value = 'http://llocalhost:8080';
      const spyFn = spy(LoginFormComponent.prototype, 'setState');
      wrapper.instance().changeHandler(key, value);
      expect(spyFn).to.have.been.calledWith({ [key]: value });
    });
  });

  describe('onLoginSubmission', () => {
    it('it should expose onAccountUpdated as function', () => {
      const wrapper = mount(<LoginFormComponent {...store} />);
      expect(typeof wrapper.props().onAccountUpdated).to.equal('function');
    });

    it.skip('it should call activePeerSet', () => {
      const wrapper = mount(<LoginFormComponent {...store} />);
      wrapper.instance().onLoginSubmission();
      expect(wrapper.props().spyActivePeerSet).to.have.been.calledWith();
    });

    it('it should call setTimeout', () => {
      const wrapper = mount(<LoginFormComponent {...store} />);
      const spyFn = spy(window, 'setTimeout');
      wrapper.instance().onLoginSubmission();
      expect(spyFn).to.have.been.calledWith();
    });
  });

  describe.skip('devPreFill', () => {
    it('should call validateUrl', () => {
      const spyFn = spy(LoginFormComponent.prototype, 'validateUrl');

      mount(<LoginFormComponent />, options);
      expect(spyFn).to.have.been.calledWith();
    });

    it('should set state with correct network index and passphrase', () => {
      const spyFn = spy(LoginFormComponent.prototype, 'validateUrl');
      const passphrase = 'Test Passphrase';
      document.cookie = 'address=http:localhost:4000';
      document.cookie = `passphrase=${passphrase}`;

      // for invalid address, it should set network to 0
      mount(<LoginFormComponent />, options);
      expect(spyFn).to.have.been.calledWith({
        passphrase,
        network: 0,
      });

      LoginFormComponent.prototype.validateUrl.restore();
    });

    it('should set state with correct network index and passphrase', () => {
      const spyFn = spy(LoginFormComponent.prototype, 'validateUrl');
      // for valid address should set network to 2
      const passphrase = 'Test Passphrase';
      document.cookie = `passphrase=${passphrase}`;
      document.cookie = 'address=http://localhost:4000';
      mount(<LoginFormComponent />, options);
      expect(spyFn).to.have.been.calledWith({
        passphrase,
        network: 2,
      });

      LoginFormComponent.prototype.validateUrl.restore();
    });
  });
});
