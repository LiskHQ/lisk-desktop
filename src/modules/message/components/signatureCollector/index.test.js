import React from 'react';
import { cryptography } from '@liskhq/lisk-client';
import { mount } from 'enzyme';
import loginTypes from '@auth/const/loginTypes';
import * as hwManager from '@wallet/utils/hwManager';
import wallets from '@tests/constants/wallets';
import MessageSignature from '.';

jest.mock('@wallet/utils/hwManager');
jest.spyOn(cryptography.ed, 'signDataWithPrivateKey').mockReturnValue('signature');

// TODO: All of these tests need to be rewritten to adopt to new transaction schema https://github.com/LiskHQ/lisk-sdk/blob/7e71617d281649a6942434f729a815870aac2394/elements/lisk-transactions/src/schema.ts#L15
// We need to avoid lot of back and forth convertion from JSON and JS object
// For consistency we will adopt these changes similar to https://github.com/LiskHQ/lisk-sdk/blob/development/elements/lisk-api-client/src/transaction.ts
// We will address of these problem in issue https://github.com/LiskHQ/lisk-desktop/issues/4400

describe.skip('Sign Message: Status', () => {
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
      t: (v) => v,
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

    it('Should proceed with error the message', async () => {
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

    it('Should proceed with the signature', async () => {
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
