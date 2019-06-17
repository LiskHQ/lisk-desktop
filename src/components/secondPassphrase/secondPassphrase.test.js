import React from 'react';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';

import accounts from '../../../test/constants/accounts';
import i18n from '../../i18n';
import SecondPassphrase from './secondPassphrase';
import routes from '../../constants/routes';

describe('SecondPassphrase', () => {
  let wrapper;
  const account = {
    passphrase: accounts.delegate.passphrase,
    info: {
      LSK: accounts.delegate,
    },
  };
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
    registerSecondPassphrase: jest.fn(),
    t: key => key,
    history: {
      goBack: jest.fn(),
      push: jest.fn(),
    },
  };

  describe('Authenticated', () => {
    beforeEach(() => {
      wrapper = mount(<SecondPassphrase {...props} />, options);
    });

    it('renders MultiStep component and passphrase', () => {
      expect(wrapper).toContainMatchingElement('MultiStep');
      expect(wrapper).toContainMatchingElement('.passphrase');
    });

    it('unmount remove contentFocused', () => {
      expect(document.getElementsByClassName('contentFocused')).toHaveLength(1);
      wrapper.unmount();
      expect(document.getElementsByClassName('contentFocused')).toHaveLength(0);
    });

    it('should go back in history when back button is clicked', () => {
      wrapper.find('.go-back').first().simulate('click');
      expect(props.history.goBack).toHaveBeenCalledWith();
    });

    it('should go to dashboard if account already has second passphrase', () => {
      wrapper = mount(<SecondPassphrase {...props}
        account={{
          info: { LSK: accounts['second passphrase account'] },
        }} />, options);
      expect(props.history.push).toHaveBeenCalledWith(routes.dashboard.path);
    });
  });
});
