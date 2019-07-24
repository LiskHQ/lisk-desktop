import React from 'react';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import { generatePassphrase } from '../../utils/passphrase';
import { extractAddress } from '../../utils/account';
import i18n from '../../i18n';
import BackupPassphrase from './backupPassphrase';


describe('Register Process - Backup Passphrase', () => {
  let wrapper;

  const passphrase = generatePassphrase();
  const account = {
    address: extractAddress(passphrase),
    passphrase,
  };

  const options = {
    context: { i18n },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
    },
  };

  const props = {
    account,
    nextStep: spy(),
  };

  it('Should go to next step when clicking confirm', () => {
    wrapper = mount(<BackupPassphrase {...props} />, options);
    wrapper.find('.yes-its-safe-button').at(1).simulate('click');
    expect(props.nextStep).to.have.been.calledWith();
  });
});
