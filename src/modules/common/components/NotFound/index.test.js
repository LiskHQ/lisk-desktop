import React from 'react';
import { mount } from 'enzyme';
import routes from 'src/routes/routes';
import NotFound from './index';

describe('notFound', () => {
  const props = {
    history: {
      location: {
        pathname: '',
        search: '',
      },
      push: jest.fn(),
      replace: jest.fn(),
      createHref: jest.fn(),
    },
  };

  it('should render correctly', () => {
    const wrapper = mount(<NotFound {...props} />);
    expect(wrapper.find('section')).toHaveLength(1);
    expect(wrapper).toContainMatchingElement('Illustration');
    expect(wrapper).toContainMatchingElement('.go-to-dashboard-button');
  });

  it('should go to Dashboard on button link', () => {
    const wrapper = mount(<NotFound {...props} />);
    expect(wrapper.find('.go-to-dashboard-button').at(0).props().to).toBe(routes.wallet.path);
  });
});
