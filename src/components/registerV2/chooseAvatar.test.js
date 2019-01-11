import React from 'react';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import sinon from 'sinon';
import { generatePassphrase } from '../../utils/passphrase';
import { extractAddress } from '../../utils/account';
import i18n from '../../i18n';
import ChooseAvatar from './chooseAvatar';

describe('V2 Register Process - Choose Avatar', () => {
  let wrapper;

  const crypotObj = window.crypto || window.msCrypto;
  const passphrases = [...Array(5)].map(() =>
    generatePassphrase({
      seed: [...crypotObj.getRandomValues(new Uint16Array(16))].map(x => (`00${(x % 256).toString(16)}`).slice(-2)),
    }));
  const accounts = passphrases.map(pass => ({
    address: extractAddress(pass),
    passphrase: pass,
  }));

  const options = {
    context: { i18n },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
    },
  };

  const props = {
    handleSelectAvatar: sinon.spy(),
    selected: '',
    accounts,
  };

  beforeEach(() => {
    wrapper = mount(<MemoryRouter>
      <ChooseAvatar {...props} />
    </MemoryRouter>, options);
  });

  it('Should render with five avatars and confirm button disabled', () => {
    expect(wrapper.find('AccountVisual')).to.have.length(5);
    expect(wrapper.find('Button').at(1).prop('disabled'));
  });

  it('Should pass selected address to handler function', () => {
    const randomAvatar = Math.floor(Math.random() * 5);
    const confirmButton = wrapper.find('Button').at(1);
    expect(confirmButton.prop('disabled'));
    wrapper.find('AccountVisual').at(randomAvatar).simulate('click');
    expect(props.handleSelectAvatar).to.have.been.calledWith(accounts[randomAvatar]);

    wrapper.setProps({
      children: React.cloneElement(wrapper.props().children, {
        selected: accounts[randomAvatar],
      }),
    });

    expect(wrapper.find('ChooseAvatar').prop('selected')).to.be.eql(accounts[randomAvatar]);
  });
});
