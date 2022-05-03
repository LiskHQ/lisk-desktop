import React from 'react';
import { mount } from 'enzyme';
import loginTypes from 'src/modules/auth/const/loginTypes';
import * as hwManager from '@wallet/utilities/hwManager';
import wallets from '@tests/constants/wallets';
import MessageSignature from '.';

jest.mock('@wallet/utilities/hwManager');

describe('Sign Message: Status', () => {
  const walletWithPassphrase = {
    ...wallets.genesis,
    loginType: loginTypes.passphrase.code,
  };
  const walletWithHW = {
    ...wallets.genesis,
    loginType: loginTypes.ledger,
    hwInfo: {
      deviceModel: 'Ledger Nano S',
    },
  };

  describe('Using Passphrase', () => {
    const props = {
      account: walletWithPassphrase,
      message: 'Random message',
      t: v => v,
      isNext: true,
      nextStep: jest.fn(),
    };

    it('Should render empty div', () => {
      const wrapper = mount(<MessageSignature {...props} />);
      wrapper.update();
      expect(wrapper.find('div')).toExist();
    });

    it('sign and call nextStep', () => {
      const wrapper = mount(<MessageSignature {...props} />);
      wrapper.update();
      expect(props.nextStep).toHaveBeenCalledWith({
        error: undefined,
        signature: expect.any(String),
        message: props.message,
      });
    });
  });

  describe('Using hardware wallet', () => {
    const props = {
      account: walletWithHW,
      message: 'Random message',
      t: (str, data) => {
        if (!data) return str;
        return str.replace('{{model}}', data.model);
      },
      nextStep: jest.fn(),
    };

    it.skip('Should proceed with error the message', async () => {
      const error = new Error('sample message');
      hwManager.signMessageByHW.mockImplementation(() => Promise.reject(error));
      const wrapper = mount(<MessageSignature {...props} />);
      wrapper.update();
      expect(props.nextStep).toHaveBeenCalledWith({
        error,
        signature: undefined,
      });
      hwManager.signMessageByHW.mockRestore();
    });

    it.skip('Should proceed with the signature', async () => {
      hwManager.signMessageByHW.mockImplementation(() => Promise.resolve({ data: 'signature' }));
      const wrapper = mount(<MessageSignature {...props} />);
      wrapper.update();
      expect(props.nextStep).toHaveBeenCalledWith({
        signature: 'signature',
      });
      hwManager.signMessageByHW.mockRestore();
    });
  });
});
