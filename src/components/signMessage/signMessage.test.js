import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';

import accounts from '../../../test/constants/accounts';
import i18n from '../../i18n';
import SignMessage from './signMessage';

describe('SignMessage', () => {
  let wrapper;
  const peers = { data: {} };
  const account = accounts.delegate;
  const store = configureMockStore([])({
    peers,
    account,
  });
  const history = {
    location: {
      pathname: '/regiser-delegate',
    },
    listen: () => {},
    goBack: spy(),
  };

  const options = {
    context: { store, i18n, history },
    childContextTypes: {
      store: PropTypes.object.isRequired,
      i18n: PropTypes.object.isRequired,
      history: PropTypes.object.isRequired,
    },
  };
  const props = {
    account,
    peers,
    closeDialog: () => {},
    passphrase: account.passphrase,
    t: key => key,
    history,
    nextStep: spy(),
  };

  describe('Authenticated', () => {
    beforeEach(() => {
      wrapper = mount(<SignMessage {...props} />, options);
    });

    it('should render MultiStep component', () => {
      expect(wrapper.find('MultiStep')).to.have.length(1);
    });

    it('should render SignMessageInput component', () => {
      expect(wrapper.find('SignMessageInput')).to.have.length(1);
    });

    it('should allow to go back to previous screen', () => {
      const backButton = wrapper.find('.multistep-back');
      backButton.first().simulate('click');
      expect(history.goBack).to.have.been.calledWith();
    });

    it('unmount remove contentFocused', () => {
      expect(document.getElementsByClassName('contentFocused')).to.have.length(1);
      wrapper.unmount();
      expect(document.getElementsByClassName('contentFocused')).to.have.length(0);
    });

    it('should render ConfirmMessage step "verify"', () => {
      wrapper.find('Input').props().onChange('message', '123aaa');
      wrapper.update();
      const nextButton = wrapper.find('button');
      nextButton.first().simulate('click');
      expect(wrapper).to.have.descendants('ConfirmMessage');
    });

    it('should render ConfirmMessage step "done"', () => {
      expect(wrapper).to.not.have.descendants('ConfirmMessage');
      wrapper.find('Input').props().onChange('message', '123aaa');
      wrapper.update();
      wrapper.find('button').first().simulate('click');
      expect(wrapper).to.have.descendants('ConfirmMessage');
      wrapper.find('PassphraseInput').props().onChange('message', account.passphrase);
      wrapper.update();
      wrapper.find('Button').props().onClick();
      expect(wrapper).to.have.descendants('ConfirmMessage');
    });

    it('should not render ConfirmMessage step "done" when passphrase is not from active account', () => {
      expect(wrapper).to.not.have.descendants('ConfirmMessage');
      wrapper.find('Input').props().onChange('message', '123aaa');
      wrapper.update();
      wrapper.find('button').first().simulate('click');
      expect(wrapper).to.have.descendants('ConfirmMessage');
      wrapper.find('PassphraseInput').props().onChange('message', account.passphrase);
      wrapper.update();
      wrapper.find('Button').props().onClick();
      expect(wrapper).to.have.descendants('ConfirmMessage');
    });
  });
});
