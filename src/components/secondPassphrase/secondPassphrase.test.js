import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';

import accounts from '../../../test/constants/accounts';
import i18n from '../../i18n';
import SecondPassphrase from './secondPassphrase';
import routes from '../../constants/routes';

describe('SecondPassphrase', () => {
  let wrapper;
  const account = accounts.delegate;
  const store = configureMockStore([])({
    account,
  });
  const options = {
    context: { store, i18n },
    childContextTypes: {
      store: PropTypes.object.isRequired,
      i18n: PropTypes.object.isRequired,
    },
  };
  const props = {
    account,
    closeDialog: () => {},
    passphrase: account.passphrase,
    registerSecondPassphrase: spy(),
    t: key => key,
    history: {
      goBack: spy(),
      push: spy(),
    },
  };

  describe('Authenticated', () => {
    beforeEach(() => {
      wrapper = mount(<SecondPassphrase {...props} />, options);
    });

    it('renders MultiStep component', () => {
      expect(wrapper.find('MultiStep')).to.have.length(1);
    });

    it('unmount remove contentFocused', () => {
      expect(document.getElementsByClassName('contentFocused')).to.have.length(1);
      wrapper.unmount();
      expect(document.getElementsByClassName('contentFocused')).to.have.length(0);
    });

    it('should go back in history when back button is clicked', () => {
      wrapper.find('.multistep-back').simulate('click');
      expect(props.history.goBack).to.have.calledWith();
    });

    it('should go to dashboard if account already has second passphrase', () => {
      wrapper = mount(<SecondPassphrase {...props}
        account={accounts['second passphrase account']} />, options);
      expect(props.history.push).to.have.calledWith(routes.dashboard.path);
    });
  });
});
