import React from 'react';
import { mount } from 'enzyme';
import { passphrase as LiskPassphrase } from '@liskhq/lisk-client';
import routes from 'src/routes/routes';
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
    nextStep: jest.fn(),
  };

  it('Should go to next step when clicking confirm', () => {
    wrapper = mount(<BackupPassphrase {...props} />);
    expect(wrapper.find('span').at(0)).toHaveText(
      'Writing it down manually offers greater security compared to copying and pasting the recovery phrase, or downloading the paper wallet.'
    );
    wrapper.find('.yes-its-safe-button').at(1).simulate('click');
    expect(props.nextStep).toHaveBeenCalledTimes(1);
    expect(props.nextStep).toHaveBeenCalledWith();
  });

  it('Should go to wallet page when clicking "Back to wallet" button', () => {
    const updatedProps = { ...props, isJsonBackup: true };
    wrapper = mount(<BackupPassphrase {...updatedProps} />);
    expect(wrapper.find('span').at(0)).toHaveText(
      'Writing it down manually offers greater security compared to copying and pasting the recovery phrase.'
    );
    wrapper.find('Button').last().simulate('click');
    expect(mockHistory.push).toHaveBeenCalledTimes(1);
    expect(mockHistory.push).toHaveBeenCalledWith(routes.wallet.path);
  });
});
