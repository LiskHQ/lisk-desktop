import React from 'react';
import { mount } from 'enzyme';
import accounts from '@tests/constants/wallets';
import * as transactionUtils from '@transaction/utils/transaction';
import { useCurrentAccount } from '@account/hooks';
import savedAccounts from '@tests/fixtures/accounts';
import PassphraseBackup from '.';

jest.mock('@transaction/utils/transaction');
jest.mock('@account/hooks/useCurrentAccount');

describe('PassphraseBackup', () => {
  let wrapper;
  const props = {
    passphrase: accounts.genesis.passphrase,
    t: (key) => key,
  };

  it('should show tip after copying passphrase', () => {
    useCurrentAccount.mockReturnValue([{}]);
    wrapper = mount(<PassphraseBackup {...props} />);
    expect(wrapper.find('.tip')).toHaveClassName('hidden');
    wrapper.find('CopyToClipboard').at(0).simulate('click');
    expect(wrapper.find('.tip')).not.toHaveClassName('hidden');
    expect(wrapper.find('.tip')).toHaveText('Make sure to store it somewhere safe');

    jest.advanceTimersByTime(3100);
    wrapper.update();
    expect(wrapper.find('.tip')).toHaveClassName('hidden');
  });

  it('should download the JSON backup file when clicked', () => {
    const updatedProps = { ...props, jsonBackup: true };
    useCurrentAccount.mockReturnValue([savedAccounts[0]]);
    wrapper = mount(<PassphraseBackup {...updatedProps} />);
    wrapper.find('img').last().simulate('click');
    expect(transactionUtils.downloadJSON).toHaveBeenCalled();
  });

  it('should download the JSON backup file with fallback values when clicked', () => {
    const updatedProps = { ...props, jsonBackup: true };
    useCurrentAccount.mockReturnValue([{}]);
    wrapper = mount(<PassphraseBackup {...updatedProps} />);
    wrapper.find('img').last().simulate('click');
    expect(transactionUtils.downloadJSON).toHaveBeenCalled();
  });
});
