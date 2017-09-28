import PropTypes from 'prop-types';
import React from 'react';

import { expect } from 'chai';
import { mount } from 'enzyme';

import Settings from './index';
import i18n from '../../i18n';

// import * as accountApi from '../../utils/api/account';


describe('Settings', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
    };
    wrapper = mount(<Settings {...props} />, {
      context: { i18n },
      childContextTypes: {
        i18n: PropTypes.object.isRequired,
      },
    });
  });

  it('renders a LanguageDropdown component', () => {
    expect(wrapper.find('LanguageDropdown')).to.have.length(1);
  });
});
