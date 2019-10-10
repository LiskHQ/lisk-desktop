import React from 'react';
import { mount } from 'enzyme';
import { Header } from './header';
import routes from '../../../constants/routes';

describe('Header', () => {
  const props = {
    t: key => key,
    history: {
      push: jest.fn(),
      location: {
        pathname: routes.monitor.path,
      },
    },
  };

  it('allows to switch to blocks', () => {
    const wrapper = mount(<Header {...props} />);
    wrapper.find('.blocks').simulate('click');
    expect(props.history.push).toHaveBeenCalledWith(routes.blocks.path);
  });
});
