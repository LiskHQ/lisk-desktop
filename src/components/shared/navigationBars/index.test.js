import React from 'react';
import { shallow } from 'enzyme';
import NavigationBars from './index';
import TopBar from './topBar';

describe('Header', () => {
  const props = {
    location: {
      pathname: '/',
    },
  };

  it('should render TopBar if prop.isSigninFlow', () => {
    props.isSigninFlow = false;
    const wrapper = shallow(<NavigationBars {...props} />);
    expect(wrapper).toContainMatchingElement(TopBar);
  });
});
