import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { MemoryRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';
import i18n from '../../i18n';
import ExternalLinks from './externalLinks';
import feedbackLinks from '../../constants/feedbackLinks';
import routes from '../../constants/routes';

describe('ExternalLinks', () => {
  let wrapper;

  const mountWithRouter = (node, options) => mount(<Router>{node}</Router>, options);

  const props = {
    links: [
      {
        label: 'Feedback',
        path: `${feedbackLinks.general}`,
        id: 'feedback',
        icon: 'feedback-icon',
        internal: false,
      },
      {
        label: 'Help',
        path: `${routes.help.path}`,
        id: 'help',
        icon: 'help-icon',
        internal: true,
      },
    ]
  };

  const history = {
    location: { pathname: `${routes.dashboard.path}` },
  };

  const options = {
    context: {
      history, i18n, router: { route: history, history },
    },
    childContextTypes: {
      history: PropTypes.object.isRequired,
      i18n: PropTypes.object.isRequired,
      router: PropTypes.object.isRequired,
    },
  };

  beforeEach(() => {
    wrapper = mountWithRouter(<ExternalLinks {...props} />, options);
  });

  it('renders <ExternalLinks /> component', () => {
    expect(wrapper.find('.wrapper')).to.have.length(1);
  });

  it('renders Feedback link properly', () => {
    expect(wrapper.find('a').at(0)).to.have.text('Feedback');
  });

  it('renders Help link properly', () => {
    expect(wrapper.find('a').at(1)).to.have.text('Help');
  });
});
