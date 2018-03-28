import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import PropTypes from 'prop-types';
import i18n from '../../i18n';
import AccountCard from './accountCard';


describe('SavedAccounts', () => {
  const account = {
    passsphrase: 'dolphin inhale planet talk insect release maze engine guilt loan attend lawn',
    publicKey: 'ecf6a5cc0b7168c7948ccfaa652cce8a41256bdac1be62eb52f68cde2fb69f2d',
    balance: 0,
    network: 1,
  };

  const props = {
    account,
    t: str => str,
    isEditing: false,
    handleRemove: spy(),
    isSecureAppears: false,
    isSelectedForRemove: spy(),
    selectForRemove: spy(),
    onClick: spy(),
    handleRemovePassphrase: spy(),
  };

  it('should prevent event propagation if clicked on address', () => {
    const wrapper = mount(<AccountCard {...props} />, {
      context: { i18n },
      childContextTypes: {
        i18n: PropTypes.object.isRequired,
      },
    });
    // Address won't propagate
    wrapper.find('.address').simulate('click');
    expect(props.onClick).to.not.have.been.calledWith();
    // but any other element with do
    wrapper.find('h2').simulate('click');
    expect(props.onClick).to.have.been.calledWith();
  });
});
