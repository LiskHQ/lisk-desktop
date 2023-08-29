import React from 'react';
import { mount } from 'enzyme';
import { passphrase as LiskPassphrase } from '@liskhq/lisk-client';
import BackupPassphrase from './SavePassphrase';

const mockHistory = {
  location: {
    pathname: '',
  },
  push: jest.fn(),
  goBack: jest.fn(),
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => mockHistory,
}));

describe('Register Process - Backup Passphrase', () => {
  let wrapper;

  const passphrase = LiskPassphrase.Mnemonic.generateMnemonic();

  const props = {
    passphrase,
  };

  it('Should go to next step when clicking confirm', () => {
    wrapper = mount(<BackupPassphrase {...props} />);
    wrapper.find('Button').last().simulate('click');
    expect(mockHistory.push).toHaveBeenCalled();
  });
});
