import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import { passphrase as LiskPassphrase } from '@liskhq/lisk-client';
import BackupPassphrase from './SavePassphrase';

describe('Register Process - Backup Passphrase', () => {
  let wrapper;

  const passphrase = LiskPassphrase.Mnemonic.generateMnemonic();

  const props = {
    passphrase,
    nextStep: spy(),
  };

  it('Should go to next step when clicking confirm', () => {
    wrapper = mount(<BackupPassphrase {...props} />);
    wrapper.find('.yes-its-safe-button').at(1).simulate('click');
    expect(props.nextStep).to.have.been.calledWith();
  });
});
