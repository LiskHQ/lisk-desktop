import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import i18n from '../../i18n';
import SettingsNewsFeed from './settingsNewsFeed';

describe('SettingsNewsFeed', () => {
  const options = {
    context: { i18n },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
    },
  };

  const t = key => key;

  const props = {
    channels: { twitter: true },
    t,
    setNewsChannels: () => {},
  };

  it('should render SettingsNewsFeed', () => {
    const wrapper = mount(<MemoryRouter>
      <SettingsNewsFeed {...props} />
    </MemoryRouter>, options);

    expect(wrapper).to.have.descendants('.settingsNewsFeed');
  });

  it('should render SettingsNewsFeed', () => {
    const wrapper = mount(<SettingsNewsFeed {...props} />, options);
    wrapper.find('input').at(0).simulate('change', { target: { value: true } });
    expect(wrapper.find('input').props().value).to.have.equal(true);
  });
});
