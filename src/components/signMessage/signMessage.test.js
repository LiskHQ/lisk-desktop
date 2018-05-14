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
    registerSecondPassphrase: spy(),
    t: key => key,
    history,
  };

  describe('Authenticated', () => {
    beforeEach(() => {
      wrapper = mount(<SignMessage {...props} />, options);
    });

    it('renders MultiStep component', () => {
      expect(wrapper.find('MultiStep')).to.have.length(1);
    });

    it('renders SignMessageInput component', () => {
      expect(wrapper.find('SignMessageInput')).to.have.length(1);
    });

    it('allows to go back to previous screen', () => {
      const backButton = wrapper.find('.multistep-back');
      backButton.first().simulate('click');
      expect(history.goBack).to.have.been.calledWith();
    });

    it('unmount remove contentFocused', () => {
      expect(document.getElementsByClassName('contentFocused')).to.have.length(1);
      wrapper.unmount();
      expect(document.getElementsByClassName('contentFocused')).to.have.length(0);
    });
  });
});
