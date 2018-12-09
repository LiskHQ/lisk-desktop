import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import i18n from '../../i18n';
import Request from './request';

describe('Render Request', () => {
  let wrapper;
  let props;
  let store;

  beforeEach(() => {
    const history = {
      location: {
        pathname: 'request',
        search: '',
      },
      push: () => {},
    };

    props = {
      history,
      address: '12345L',
      t: key => key,
    };

    store = configureMockStore([thunk])({
      settings: { currency: 'USD' },
      settingsUpdated: () => {},
      liskService: {
        success: true,
        LSK: {
          USD: 1,
        },
      },
    });

    wrapper = mount(<Request {...props}/>, {
      context: { store, i18n },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
      },
    });
  });

  it('render Request component', () => {
    expect(wrapper.exists()).to.equal(true);
  });

  it('render Request component without address', () => {
    props.address = undefined;
    wrapper = mount(<Request {...props}/>, {
      context: { store, i18n },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
      },
    });
    expect(wrapper.exists()).to.equal(true);
  });

  it('go to transaction page on click back button', () => {
    wrapper.find('Button').at(0).simulate('click');
    wrapper.update();
  });
});
