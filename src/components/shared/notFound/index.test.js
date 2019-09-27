import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import NotFound from './index';
import i18n from '../../../i18n';

describe('notFound', () => {
  const mountWithRouter = (node, options) => mount(<Router>{node}</Router>, options);

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

  const options = {
    context: {
      i18n,
      history: props.history,
      router: {
        route: props.history,
        history: props.history,
      },
    },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
      history: PropTypes.object.isRequired,
      router: PropTypes.object.isRequired,
    },
  };

  it('should render correctly', () => {
    const wrapper = mountWithRouter(<NotFound />, options);
    expect(wrapper.find('section')).toHaveLength(1);
    expect(wrapper).toContainMatchingElement('Illustration');
    expect(wrapper).toContainMatchingElement('.go-to-dashboard-button');
  });

  it('should go to Dashboard on button link', () => {
    const wrapper = mount(<NotFound />, options);
    expect(wrapper.find('.go-to-dashboard-button').at(0).props().to).toBe('/dashboard');
  });
});
