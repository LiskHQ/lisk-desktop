import React from 'react';
import { mount } from 'enzyme';
import DialogHolder from '../../toolbox/dialog/holder';
import accounts from '../../../../test/constants/accounts';
import SecondPassphrase from './secondPassphrase';

describe('SecondPassphrase', () => {
  let wrapper;
  let props;
  const account = {
    passphrase: accounts.delegate.passphrase,
    info: {
      LSK: accounts.delegate,
    },
  };
  DialogHolder.hideDialog = jest.fn();

  describe('Authenticated', () => {
    beforeEach(() => {
      props = {
        account,
        t: key => key,
        history: {
          goBack: jest.fn(),
          push: jest.fn(),
        },
      };
      wrapper = mount(<SecondPassphrase {...props} />);
    });

    const selectRightWord = (comp, secondPassphrase) => {
      comp.find('div.option').forEach(option =>
        secondPassphrase.includes(option.text()) && option.simulate('click'));
    };

    it('renders MultiStep component and passphrase', () => {
      expect(wrapper).toContainMatchingElement('MultiStep');
      expect(wrapper).toContainMatchingElement('.passphrase');
    });

    it('unmount remove contentFocused', () => {
      expect(document.getElementsByClassName('contentFocused')).toHaveLength(1);
      wrapper.unmount();
      expect(document.getElementsByClassName('contentFocused')).toHaveLength(0);
    });

    it('should go to settings if account already has second passphrase', () => {
      wrapper = mount(<SecondPassphrase
        {...props}
        account={accounts.second_passphrase_account}
      />);
      expect(DialogHolder.hideDialog).toHaveBeenCalled();
    });

    it('should go to settings if account has not enough balance', () => {
      wrapper = mount(<SecondPassphrase
        {...props}
        account={accounts.empty_account}
      />);
      expect(DialogHolder.hideDialog).toHaveBeenCalled();
    });

    it('should allow to registerSecondPassphrase and go to wallet', () => {
      props.secondPassphraseRegistered = jest.fn(({ callback }) => {
        callback({ success: true });
      });
      wrapper = mount(<SecondPassphrase {...props} />);
      const secondPassphrase = wrapper.find('.passphrase').text();
      wrapper.find('.go-to-confirmation').first().simulate('click');

      selectRightWord(wrapper, secondPassphrase);
      selectRightWord(wrapper, secondPassphrase);
      wrapper.find('.confirmPassphraseFooter .confirmBtn').hostNodes().simulate('click');

      jest.runAllTimers();
      wrapper.update();
      wrapper.find('.confirmation-checkbox input').simulate('change');
      wrapper.find('.confirm-button').hostNodes().simulate('click');

      expect(props.secondPassphraseRegistered).toHaveBeenCalledWith(expect.objectContaining({
        passphrase: props.account.passphrase,
      }));
      expect(wrapper.find('h1')).toHaveText('2nd passphrase registration submitted');
    });

    it('should handle registerSecondPassphrase failure', () => {
      props.secondPassphraseRegistered = jest.fn(({ callback }) => {
        callback({ success: false, error: { message: 'custom message' } });
      });
      wrapper = mount(<SecondPassphrase {...props} />);
      const secondPassphrase = wrapper.find('.passphrase').text();
      wrapper.find('.go-to-confirmation').first().simulate('click');

      selectRightWord(wrapper, secondPassphrase);
      selectRightWord(wrapper, secondPassphrase);
      wrapper.find('.confirmPassphraseFooter Button').first().simulate('click');

      jest.runAllTimers();
      wrapper.update();
      wrapper.find('.confirmation-checkbox input').first().simulate('change');
      wrapper.find('.confirm-button').hostNodes().simulate('click');
      expect(props.secondPassphraseRegistered).toHaveBeenCalledWith(expect.objectContaining({
        passphrase: props.account.passphrase,
      }));
      expect(wrapper.find('h1')).toHaveText('2nd passphrase registration failed');
    });
  });
});
