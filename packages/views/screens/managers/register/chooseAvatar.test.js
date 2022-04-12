import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { generatePassphraseFromSeed } from '@views/utilities/passphrase';
import { extractAddressFromPassphrase } from '@wallet/utilities/account';
import ChooseAvatar from './chooseAvatar';

describe('Register Process - Choose Avatar', () => {
  let wrapper;

  const crypotObj = window.crypto || window.msCrypto;
  const passphrases = [...Array(5)].map(() =>
    generatePassphraseFromSeed({
      seed: [...crypotObj.getRandomValues(new Uint16Array(16))].map(x => (`00${(x % 256).toString(16)}`).slice(-2)),
    }));
  const accounts = passphrases.map(pass => ({
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
    expect(wrapper).to.have.exactly(5).descendants('AccountVisual');
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
    wrapper.find('AccountVisual').at(randomAvatar).simulate('click');
    expect(props.handleSelectAvatar).to.have.been.calledWith(accounts[randomAvatar]);

    wrapper.setProps({
      selected: accounts[randomAvatar],
    });

    expect(wrapper.find('ChooseAvatar').prop('selected')).to.be.eql(accounts[randomAvatar]);
  });
});
