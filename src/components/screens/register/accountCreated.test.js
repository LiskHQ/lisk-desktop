import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { generatePassphraseFromSeed } from '../../../utils/passphrase';
import { extractAddress } from '../../../utils/account';
import AccountCreated from './accountCreated';

describe('Register Process - Account created', () => {
  let wrapper;

  const crypotObj = window.crypto || window.msCrypto;
  const passphrase = generatePassphraseFromSeed({
    seed: [...crypotObj.getRandomValues(new Uint16Array(16))].map(x => (`00${(x % 256).toString(16)}`).slice(-2)),
  });
  const account = {
    address: extractAddress(passphrase),
    passphrase,
  };

  const props = {
    account,
  };

  beforeEach(() => {
    wrapper = mount(<AccountCreated {...props} />);
  });

  it('Should render with correct avatar and address', () => {
    expect(wrapper).to.have.exactly(1).descendants('AccountVisual');
    expect(wrapper.find('AccountVisual')).to.have.prop('address', account.address);
    expect(wrapper.find('.address')).to.have.text(account.address);
  });
});
