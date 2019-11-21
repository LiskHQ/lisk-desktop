import React from 'react';
import { mount } from 'enzyme';
import NotAvailable from './notAvailable';
import routes from '../../../constants/routes';

describe('NotAvailable', () => {
  const props = {
    t: key => key,
    history: {
      push: jest.fn(),
      location: {
        pathname: routes.monitor.path,
      },
    },
  };

  it('renders an illustration', () => {
    const wrapper = mount(<NotAvailable {...props} />);
    expect(wrapper.find('Illustration')).toHaveLength(1);
  });

  it('renders a button to navigate to dashboard', () => {
    const wrapper = mount(<NotAvailable {...props} />);
    wrapper.find('button').simulate('click');
    expect(props.history.push).toHaveBeenCalledWith(routes.dashboard.path);
  });
});
