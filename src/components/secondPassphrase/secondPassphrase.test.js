import React from 'react';
import { mount } from 'enzyme';

import accounts from '../../../test/constants/accounts';
import SecondPassphrase from './secondPassphrase';
import routes from '../../constants/routes';

describe('SecondPassphrase', () => {
  let wrapper;
  let props;
  const account = {
    passphrase: accounts.delegate.passphrase,
    info: {
      LSK: accounts.delegate,
    },
  };

  describe('Authenticated', () => {
    beforeEach(() => {
      props = {
        account,
        closeDialog: () => {},
        secondPassphraseRegistered: jest.fn(({ callback }) => {
          callback({ success: true });
        }),
        t: key => key,
        history: {
          goBack: jest.fn(),
          push: jest.fn(),
        },
      };
      wrapper = mount(<SecondPassphrase {...props} />);
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
        }} />);
      expect(props.history.push).toHaveBeenCalledWith(routes.dashboard.path);
    });

    it('should allow to registerSecondPassphrase and go to wallet', () => {
      wrapper.find('.go-to-confirmation').first().simulate('click');
      wrapper.find('.confirm-button').first().simulate('click');
      expect(props.secondPassphraseRegistered).toHaveBeenCalledWith(expect.objectContaining({
        passphrase: props.account.passphrase,
      }));
      expect(wrapper.find('.result-box-header')).toHaveText('Registration completed');
      wrapper.find('.go-to-wallet').first().simulate('click');
      expect(props.history.push).toHaveBeenCalledWith(routes.wallet.path);
    });

    it('should handle registerSecondPassphrase failure', () => {
      props.secondPassphraseRegistered = jest.fn(({ callback }) => {
        callback({ success: false, error: { message: 'custom message' } });
      });
      wrapper = mount(<SecondPassphrase {...props} />);
      wrapper.find('.go-to-confirmation').first().simulate('click');
      wrapper.find('.confirm-button').first().simulate('click');
      expect(props.secondPassphraseRegistered).toHaveBeenCalledWith(expect.objectContaining({
        passphrase: props.account.passphrase,
      }));
      expect(wrapper.find('.result-box-header')).toHaveText('Registration failed');
    });
  });
});
