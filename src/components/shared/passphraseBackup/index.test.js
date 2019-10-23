import React from 'react';
import { mount } from 'enzyme';
import PassphraseBackup from '.';
import { generatePassphrase } from '../../../utils/passphrase';

describe('PassphraseBackup', () => {
  let wrapper;
  const props = {
    account: {
      passphrase: generatePassphrase(),
    },
    t: jest.fn(),
  };

  it('should show tip after copying passphrase', () => {
    wrapper = mount(<PassphraseBackup {...props} />);
    wrapper.find('CopyToClipboard').at(0).simulate('click');
    expect('tip').toBeTruthy();
  });
});
