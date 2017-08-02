import React from 'react';
import chai, { expect } from 'chai';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import Lisk from 'lisk-js';
import RegisterDelegate from './registerDelegate';
import * as delegateApi from '../../utils/api/delegate';

chai.use(chaiEnzyme());

const normalAccount = {
  isDelegate: false,
  address: '16313739661670634666L',
  balance: 1000e8,
};

const delegateAccount = {
  isDelegate: true,
  address: '16313739661670634666L',
  balance: 1000e8,
  delegate: {
    username: 'lisk-nano',
  },
};

const withSecondSecretAccount = {
  isDelegate: true,
  address: '16313739661670634666L',
  balance: 1000e8,
  delegate: {
    username: 'lisk-nano',
  },
  secondSecret: 'sample phrase',
};

const props = {
  peers: {
    data: Lisk.api({
      name: 'Custom Node',
      custom: true,
      address: 'http://localhost:4000',
      testnet: true,
      nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
    }),
  },
  closeDialog: () => {},
  onAccountUpdated: () => {},
  showSuccessAlert: () => {},
  showErrorAlert: () => {},
};

const delegateProps = { ...props, account: delegateAccount };
const normalProps = { ...props, account: normalAccount };
const withSecondSecretProps = { ...props, account: withSecondSecretAccount };

describe('RegisterDelegate', () => {
  let wrapper;
  let delegateApiMock;

  beforeEach(() => {
    delegateApiMock = sinon.mock(delegateApi);
  });

  afterEach(() => {
    delegateApiMock.verify();
    delegateApiMock.restore();
  });

  describe('Ordinary account', () => {
    beforeEach(() => {
      wrapper = mount(<RegisterDelegate {...normalProps} />);
    });

    it('renders an InfoParagraph components', () => {
      expect(wrapper.find('InfoParagraph')).to.have.length(1);
    });

    it('renders one Input component for a normal account', () => {
      expect(wrapper.find('Input')).to.have.length(1);
    });

    it('allows register as delegate for a non delegate account', () => {
      delegateApiMock.expects('registerDelegate').resolves({ success: true });

      wrapper.find('.username input').simulate('change', { target: { value: 'sample_username' } });
      wrapper.find('.submit-button').simulate('click');
    });

    it('does not allow registering an existing username', () => {
      delegateApiMock.expects('registerDelegate').resolves({ success: false });

      wrapper.find('.username input').simulate('change', { target: { value: 'sample_username' } });
      wrapper.find('.submit-button').simulate('click');
    });
  });

  describe('Ordinary account with second secret', () => {
    beforeEach(() => {
      wrapper = mount(<RegisterDelegate {...withSecondSecretProps} />);
    });

    it('renders two Input component for a an account with second secret', () => {
      expect(wrapper.find('Input')).to.have.length(2);
    });

    it('allows register as delegate for a non delegate account with second secret', () => {
      delegateApiMock.expects('registerDelegate').resolves({ success: true });

      wrapper.find('.username input').simulate('change', { target: { value: 'sample_username' } });
      wrapper.find('.second-secret input').simulate('change', { target: { value: 'sample phrase' } });
      wrapper.find('.submit-button').simulate('click');
    });
  });

  describe('Delegate account', () => {
    beforeEach(() => {
      wrapper = mount(<RegisterDelegate {...delegateProps} />);
    });

    it('does not allow register as delegate for a delegate account', () => {
      delegateApiMock.expects('registerDelegate').resolves({ success: false });

      wrapper.find('.username input').simulate('change', { target: { value: 'sample_username' } });
      wrapper.find('.submit-button').simulate('click');
    });
  });
});
