import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import { extractAddressFromPassphrase } from '@wallet/utilities/account';
import { generatePassphrase } from '@common/utilities/passphrase';
import BackupPassphrase from './backupPassphrase';

describe('Register Process - Backup Passphrase', () => {
  let wrapper;

  const passphrase = generatePassphrase();
  const account = {
    address: extractAddressFromPassphrase(passphrase),
    passphrase,
  };

  const props = {
    account,
    nextStep: spy(),
  };

  it('Should go to next step when clicking confirm', () => {
    wrapper = mount(<BackupPassphrase {...props} />);
    wrapper.find('.yes-its-safe-button').at(1).simulate('click');
    expect(props.nextStep).to.have.been.calledWith();
  });
});
