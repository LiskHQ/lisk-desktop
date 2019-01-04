import React from 'react';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import i18n from '../../i18n';
import SplashScreen from './splashscreen';

describe('V2 SplashScreen', () => {
  let wrapper;
  const options = {
    context: { i18n },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
    },
  };

  beforeEach(() => {
    wrapper = mount(<MemoryRouter><SplashScreen /></MemoryRouter>, options);
  });

  it('Should render all links, Sign in, Create an Account and Explre as Guest', () => {
    const buttons = wrapper.find('.wrapper').children('.button');
    expect(buttons.at(0).text()).to.equal('Sign in');
    expect(buttons.at(1).text()).to.equal('Create an Account');
    expect(wrapper.find('.link').at(0).text()).to.equal('Explore as a Guest');
  });
});
