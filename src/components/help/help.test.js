import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { spy } from 'sinon';
import Help from './help';
import links from './../../constants/help';

describe('Help Page', () => {
  let wrapper;
  let props;

  let windowOpenSpy;

  beforeEach(() => {
    props = {
      account: {
        address: '123L',
      },
      t: key => key,
      settingsUpdated: spy(),
    };

    windowOpenSpy = spy(window, 'open');
    wrapper = shallow(<Help {...props} />);
  });

  it('renders three help article sections with proper btn callbacks', () => {
    expect(wrapper).to.have.exactly(3).descendants('.help-articles article');

    wrapper.find('.help-onboarding').simulate('click');
    expect(props.settingsUpdated).to.have.been.calledWith({ onBoarding: true });

    wrapper.find('.help-visit-center').simulate('click');
    expect(windowOpenSpy).to.have.been.calledWith(links.helpCenter, '_blank');

    const propsNotLoggedIn = {
      ...props,
    };
    delete propsNotLoggedIn.account.address;
    wrapper.setProps(propsNotLoggedIn);
    wrapper.update();
    expect(wrapper).to.have.exactly(0).descendants('.help-onboarding');
  });
});
