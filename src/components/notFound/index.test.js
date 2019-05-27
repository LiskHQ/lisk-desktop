import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import NotFound from './index';
import i18n from '../../i18n';

describe('notFound', () => {
  const mountWithRouter = (node, options) => mount(<Router>{node}</Router>, options);

  const options = {
    context: { i18n },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
    },
  };

  it('should render correctly', () => {
    const wrapper = mountWithRouter(<NotFound/>, options);
    expect(wrapper.find('section')).toHaveLength(1);
    expect(wrapper).toContainMatchingElement('Illustration');
    expect(wrapper).toContainMatchingElement('.go-to-dashboard-button');
  });
});

