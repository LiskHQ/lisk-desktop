import PropTypes from 'prop-types';
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Options from './options';
import i18n from '../../i18n';


describe('Options', () => {
  let wrapper;
  const text = 'some random text';
  const options = {
    context: { i18n },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
    },
  };
  const props = {
    firstButton: {
      text,
      onClickHandler: () => {},
    },
    secondButton: {
      text,
      onClickHandler: () => {},
    },
    text: 'test_text',
    title: 'title_test',
  };

  beforeEach(() => {
    wrapper = mount(<Options {...props} />, options);
  });

  it('renders Options properly', () => {
    expect(wrapper).to.have.descendants('Options');
  });
});
