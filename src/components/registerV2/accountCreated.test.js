import React from 'react';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import i18n from '../../i18n';
import { generatePassphrase } from '../../utils/passphrase';
import { extractAddress } from '../../utils/account';
import AccountCreated from './accountCreated';

describe('V2 Register Process - Account created', () => {
  let wrapper;

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
      <AccountCreated {...props} />
    </MemoryRouter>, options);
  });

  it('Should render with correct avatar and address', () => {
    expect(wrapper.find('AccountVisual')).to.have.length(1);
    expect(wrapper.find('AccountVisual').prop('address')).to.have.equal(account.address);
    expect(wrapper.find('.address').text()).to.be.equal(account.address);
  });
});
