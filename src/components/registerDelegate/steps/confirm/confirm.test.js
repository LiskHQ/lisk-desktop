import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import Confirm from './confirm';
import accounts from '../../../../../test/constants/accounts';
import routes from '../../../../constants/routes';

describe('Confirm', () => {
  let wrapper;
  const props = {
    passphrase: {
      value: accounts.genesis.passphrase,
    },
    account: {},
    delegate: {},
    delegateName: 'peter',
    history: {
      replace: spy(),
    },
    prevStep: spy(),
    t: key => key,
  };

  beforeEach(() => {
    wrapper = mount(<Confirm {...props} />);
  });

  it('should redirect to dashboard on confirmation page action button pressed', () => {
    wrapper.setProps({ state: { step: 'register-success' } });
    wrapper.update();
    wrapper.find('.registration-success').first().simulate('click');
    expect(props.history.replace).to.have.been.calledWith(routes.dashboard.path);
  });

  it('should redirect to first step when register failure and try again pressed', () => {
    wrapper.setProps({ state: { step: 'register-failure' } });
    wrapper.find('.registration-failure').first().simulate('click');
    expect(props.prevStep).to.have.been.calledWith({ reset: true });
  });
});
