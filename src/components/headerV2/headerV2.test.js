import React from 'react';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import i18n from '../../i18n';
import HeaderV2 from './headerV2';

describe('New Header', () => {
  let wrapper;
  const options = {
    context: { i18n },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
    },
  };

  beforeEach(() => {
    wrapper = mount(<MemoryRouter><HeaderV2 /></MemoryRouter>, options);
  });

  it('should render Logo and Settings Button', () => {
    expect(wrapper.find('.logo').exists()).to.equal(true);
    expect(wrapper.find('.settingButton').exists()).to.equal(true);
  });
});
