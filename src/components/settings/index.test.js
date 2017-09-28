import PropTypes from 'prop-types';
import React from 'react';

import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

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

  it('renders a form and a Dropdown components', () => {
    expect(wrapper.find('Dropdown')).to.have.length(1);
  });

  it('calls i18n.changeLanguage on chaning the value in the dropdown', () => {
    const i18nSpy = sinon.spy(i18n, 'changeLanguage');

    wrapper.find('Dropdown').simulate('click');
    wrapper.find('Dropdown ul li').at(0).simulate('click');
    expect(i18nSpy).to.have.been.calledWith('en');

    i18nSpy.restore();
  });
});
