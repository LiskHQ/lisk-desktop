import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import PropTypes from 'prop-types';

import i18n from '../../i18n';
import MultiStep from '../multiStep';
import Send from './index';
import styles from './styles.css';

describe('Send', () => {
  let wrapper;
  let transactions;
  let peers;
  let store;
  let history;
  let options;

  beforeEach(() => {
    transactions = {
    };
    peers = {
      data: {},
      options: {},
    };
    store = configureMockStore([])({
      peers,
      transactions,
    });
    history = {
      location: {
        pathname: '',
        search: '',
      },
      replace: spy(),
      createHref: spy(),
      push: spy(),
    };

    options = {
      context: {
        store, history, i18n, router: { route: history, history },
      },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
        router: PropTypes.object.isRequired,
      },
      lifecycleExperimental: true,
    };
    wrapper = mount(<Send/>, options);
  });

  it('should render MultiStep component ', () => {
    expect(wrapper.find(MultiStep)).to.have.lengthOf(1);
  });

  it('clicking send menu item should activate the send component', () => {
    wrapper.find('.send-menu-item').simulate('click');
    expect(wrapper.find('.send-box').first()).to.have.className(styles.isActive);
  });
});

