import React from 'react';
import { mount } from 'enzyme';
import accounts from '@tests/constants/wallets';
import PassphraseBackup from '.';

describe('PassphraseBackup', () => {
  let wrapper;
  const props = {
    passphrase: accounts.genesis.passphrase,
    t: (key) => key,
  };

  it('should show tip after copying passphrase', () => {
    wrapper = mount(<PassphraseBackup {...props} />);
    expect(wrapper.find('.tip')).toHaveClassName('hidden');
    wrapper.find('CopyToClipboard').at(0).simulate('click');
    expect(wrapper.find('.tip')).not.toHaveClassName('hidden');
    expect(wrapper.find('.tip')).toHaveText('Make sure to store it somewhere safe');

    jest.advanceTimersByTime(3100);
    wrapper.update();
    expect(wrapper.find('.tip')).toHaveClassName('hidden');
  });
});
