import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { extractAddressFromPassphrase } from '@wallet/utils/account';
import { generatePassphraseFromSeed } from '@wallet/utils/passphrase';
import ChooseAvatar from './chooseAvatar';

// @todo: this should be re-instated when the issue with lisk-client is fixed
describe.skip('Register Process - Choose Avatar', () => {
  let wrapper;

  const cryptoObj = window.crypto || window.msCrypto;
  const passphrases = [...Array(5)].map(() =>
    generatePassphraseFromSeed({
      seed: [...cryptoObj.getRandomValues(new Uint16Array(16))].map((x) =>
        `00${(x % 256).toString(16)}`.slice(-2)
      ),
    })
  );
  const accounts = passphrases.map((pass) => ({
    address: extractAddressFromPassphrase(pass),
    passphrase: pass,
  }));

  const props = {
    handleSelectAvatar: sinon.spy(),
    selected: '',
    accounts,
  };

  beforeEach(() => {
    wrapper = mount(<ChooseAvatar {...props} />);
  });

  it('Should render with five avatars', () => {
    expect(wrapper).to.have.exactly(5).descendants('WalletVisual');
  });

  it('Should animate avatars when confirm is clicked', () => {
    expect(wrapper.find('.avatarsHolder')).to.not.have.className('animate');
    wrapper.find('Button').at(1).simulate('click');
    expect(wrapper.find('.avatarsHolder')).to.have.className('animate');
  });

  it('Should pass selected address to handler function', () => {
    const randomAvatar = Math.floor(Math.random() * 5);
    const confirmButton = wrapper.find('Button').at(1);
    expect(confirmButton.prop('disabled'));
    wrapper.find('WalletVisual').at(randomAvatar).simulate('click');
    expect(props.handleSelectAvatar).to.have.been.calledWith(accounts[randomAvatar]);

    wrapper.setProps({
      selected: accounts[randomAvatar],
    });

    expect(wrapper.find('ChooseAvatar').prop('selected')).to.be.eql(accounts[randomAvatar]);
  });
});
