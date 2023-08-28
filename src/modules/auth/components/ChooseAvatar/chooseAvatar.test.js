import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { cryptography } from '@liskhq/lisk-client';
import wallets from '@tests/constants/wallets';
import ChooseAvatar from './chooseAvatar';
import { getPassphraseAndAddress } from '../../hooks/useCreateAccounts';

describe('Register Process - Choose Avatar', () => {
  let wrapper;

  const { privateKey, publicKey } = wallets.genesis.summary;
  const defaultKeys = {
    privateKey: Buffer.from(privateKey, 'hex'),
    publicKey: Buffer.from(publicKey, 'hex'),
  };
  jest.spyOn(cryptography.legacy, 'getKeys').mockReturnValue(defaultKeys);

  let accounts;

  const props = {
    handleSelectAvatar: sinon.spy(),
    selected: '',
    accounts,
  };

  beforeEach(async () => {
    accounts = await Promise.all([...Array(5)].map(() => getPassphraseAndAddress(128)));
    props.accounts = accounts;
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
