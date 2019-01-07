import React from 'react';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { useFakeTimers } from 'sinon';
import { MemoryRouter } from 'react-router-dom';
import { generatePassphrase } from '../../utils/passphrase';
import { extractAddress } from '../../utils/account';
import i18n from '../../i18n';
import BackupPassphrase from './backupPassphrase';


describe('V2 Register Process - Backup Passphrase', () => {
  let wrapper;
  let clock;

  const crypotObj = window.crypto || window.msCrypto;
  const passphrase = generatePassphrase({
    seed: [...crypotObj.getRandomValues(new Uint16Array(16))].map(x => (`00${(x % 256).toString(16)}`).slice(-2)),
  });
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
  };

  beforeEach(() => {
    wrapper = mount(<MemoryRouter>
      <BackupPassphrase {...props} />
    </MemoryRouter>, options);

    clock = useFakeTimers({
      now: new Date(2018, 1, 1),
      toFake: ['setTimeout', 'clearTimeout'],
    });
  });

  afterEach(() => {
    clock.restore();
  });

  it('Should render with passphrase of selected account', () => {
    expect(wrapper.find('.option p.option-value').at(0)).to.have.text(account.passphrase);
  });

  it('Should copy passphrase when clicking copy passphrase and reset after 3 seconds', () => {
    expect(wrapper.find('BackupPassphrase').instance().state.passphraseCopied).to.be.equal(false);
    wrapper.find('CopyToClipboard').simulate('click');
    expect(wrapper.find('BackupPassphrase').instance().state.passphraseCopied);
    clock.tick(3000);
    expect(wrapper.find('BackupPassphrase').instance().state.passphraseCopied).to.be.equal(false);
  });
});
