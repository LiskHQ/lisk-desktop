import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import NotFound from './index';
import i18n from '../../i18n';

describe('notFound', () => {
  const options = {
    context: { i18n },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
    },
  };

  it('should render a Box', () => {
    const wrapper = mount(<NotFound />, options);
    expect(wrapper.find('Box')).to.have.lengthOf(1);
  });
});
