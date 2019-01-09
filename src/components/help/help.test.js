import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { spy, mock } from 'sinon';
import Help from './help';
import links from './../../constants/externalLinks';

describe('Help Page', () => {
  let wrapper;
  let props;

  let windowOpenMock;

  beforeEach(() => {
    props = {
      account: {
        address: '123L',
      },
      t: key => key,
      settingsUpdated: spy(),
    };

    windowOpenMock = mock(window).expects('open').returns({ focus: spy() });
    wrapper = shallow(<Help {...props} />);
  });

  afterEach(() => {
    windowOpenMock.restore();
  });

  it('renders three help article sections with proper btn callbacks', () => {
    expect(wrapper).to.have.exactly(3).descendants('.help-articles article');

    wrapper.find('.help-onboarding').simulate('click');
    expect(props.settingsUpdated).to.have.been.calledWith({ onBoarding: true });

    wrapper.find('.help-visit-center').simulate('click');
    expect(windowOpenMock).to.have.been.calledWith(links.helpCenter, '_blank');

    const propsNotLoggedIn = {
      ...props,
    };
    delete propsNotLoggedIn.account.address;
    wrapper.setProps(propsNotLoggedIn);
    wrapper.update();
    expect(wrapper).to.have.exactly(0).descendants('.help-onboarding');
  });
});
