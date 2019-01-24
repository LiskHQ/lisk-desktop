import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';

import UnlockWallet from './unlockWallet';
import { ActionButton, Button } from './../toolbox/buttons/button';

describe('UnlockWallet', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      t: data => data,
      handleOnClick: spy(),
      cancelLedgerLogin: spy(),
    };

    wrapper = mount(<UnlockWallet {...props}/>);
  });

  it('should call cancelLedgerLogin when I click the Button', () => {
    wrapper.find(Button).props().onClick();
    expect(props.cancelLedgerLogin).to.has.been.calledWith();
  });

  it('should call handleOnClick when I click the ActionButton', () => {
    wrapper.find(ActionButton).props().onClick();
    expect(props.handleOnClick).to.has.been.calledWith();
  });
});
