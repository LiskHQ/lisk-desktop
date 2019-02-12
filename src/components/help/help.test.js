import React from 'react';
import { shallow } from 'enzyme';
import Help from './help';
import links from './../../constants/externalLinks';

describe('Help Page', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      account: {
        address: '123L',
      },
      t: key => key,
      settingsUpdated: jest.fn(),
    };

    window.open = jest.fn();
    window.open.mockReturnValue({ focus: jest.fn() });
    wrapper = shallow(<Help {...props} />);
  });

  it('renders three help article sections with proper btn callbacks', () => {
    expect(wrapper).toMatchSnapshot();

    wrapper.find('.help-onboarding').simulate('click');
    expect(props.settingsUpdated).toHaveBeenCalledWith({ onBoarding: true });

    wrapper.find('.help-visit-center').simulate('click');
    expect(window.open).toHaveBeenCalledWith(links.helpCenter, '_blank');

    const propsNotLoggedIn = {
      ...props,
    };
    delete propsNotLoggedIn.account.address;
    wrapper.setProps(propsNotLoggedIn);
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
  });
});
