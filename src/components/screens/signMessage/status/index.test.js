import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { loginTypes } from '@constants';
import * as hwManager from '@utils/hwManager';
import ConfirmMessage from '.';
import accounts from '../../../../../test/constants/accounts';

jest.mock('@utils/hwManager');

const updateWrapperAsync = async wrapper => new Promise((resolve) => {
  setImmediate(() => {
    wrapper.update();
    resolve();
  });
});

describe('Sign Message: Status', () => {
  const accountWithPassphrase = {
    ...accounts.genesis,
    loginType: loginTypes.passphrase.code,
  };
  const accountWithHW = {
    ...accounts.genesis,
    loginType: loginTypes.ledger,
    hwInfo: {
      deviceModel: 'Ledger Nano S',
    },
  };

  describe('Using Passphrase', () => {
    const props = {
      account: accountWithPassphrase,
      message: 'Random message',
      t: v => v,
    };

    it('Should render correct result', () => {
      const wrapper = mount(<ConfirmMessage {...props} />);
      expect(wrapper).toContainExactlyOneMatchingElement('textarea');
      expect(wrapper.find('textarea')).toIncludeText(props.message);
    });

    it('Should handle copying result', () => {
      const wrapper = mount(<ConfirmMessage {...props} />);
      expect(wrapper).toContainMatchingElements(2, 'button');
      wrapper.find('button').at(1).simulate('click');
      expect(wrapper.find('button').at(1)).toBeDisabled();
      act(() => {
        jest.advanceTimersByTime(3000);
      });
      wrapper.update();
      expect(wrapper.find('button').at(1)).not.toBeDisabled();
      wrapper.unmount();
    });
  });

  describe('Using hardware wallet', () => {
    const props = {
      account: accountWithHW,
      message: 'Random message',
      t: (str, data) => {
        if (!data) return str;
        return str.replace('{{model}}', data.model);
      },
    };

    it('Should render pending confirmation message', () => {
      const infoText = `Please confirm the message on your ${accountWithHW.hwInfo.deviceModel}`;
      const wrapper = mount(<ConfirmMessage {...props} />);
      expect(wrapper).toContainExactlyOneMatchingElement('ConfirmationPending');
      expect(wrapper.find('span')).toIncludeText(infoText);
    });

    it('Should render error if aborted on device', async () => {
      hwManager.signMessageByHW = jest.fn().mockImplementation(() => {
        throw new Error('sample message');
      });
      const wrapper = mount(<ConfirmMessage {...props} />);
      await updateWrapperAsync(wrapper);
      expect(wrapper).toContainExactlyOneMatchingElement('Error');
      hwManager.signMessageByHW.mockRestore();
    });

    it('Should render error if aborted on device', async () => {
      hwManager.signMessageByHW = jest.fn().mockImplementation(() => new Promise(resolve => resolve({ data: 'signature' })));
      const wrapper = mount(<ConfirmMessage {...props} />);
      await updateWrapperAsync(wrapper);
      expect(wrapper).toContainExactlyOneMatchingElement('Result');
      hwManager.signMessageByHW.mockRestore();
    });
  });
});
