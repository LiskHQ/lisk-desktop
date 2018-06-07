/* eslint-disable */
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { stub, spy } from 'sinon';
import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';

import i18n from '../../i18n';
import Search from './index';
import keyCodes from './../../constants/keyCodes';
import * as keyAction from './../search/keyAction';

describe('SearchBar', () => {
  let wrapper;
  let history;
  let props;
  let options;
  let localStorageStub;
  const store = {};
  const peers = {
    data: {},
    status: true,
  };

  // Mocking store
  beforeEach(() => {
    localStorageStub = stub(localStorage, 'getItem');
    localStorageStub.withArgs('searches').returns([]);
    spy(keyAction, 'visitAndSaveSearch');
    spy(keyAction, 'visitAndSaveSearchOnEnter');

    history = {
      location: {
        pathname: 'explorer',
        search: '',
      },
      push: spy(),
    };
    props = {
      history,
      t: () => {},
    };
    options = {
      context: {
        store: {}, history, i18n, router: { route: history, history },
      },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
        router: PropTypes.object.isRequired,
      },
      lifecycleExperimental: true,
    };
    store.getState = () => ({
      peers,
    });
    store.subscribe = () => {};
    store.dispatch = () => {};
    wrapper = mount(
      <Provider store={store}>
        <Router>
          <Search {...props} />
        </Router>
      </Provider>, options,
    );
  });

  afterEach(() => {
    localStorageStub.restore();
    keyAction.visitAndSaveSearch.restore()
    keyAction.visitAndSaveSearchOnEnter.restore()
  });

  it('should call getSearchItem on componentWillReceiveProps', () => {
    wrapper.find('Search').props().history.push('/explorer/');
    wrapper.update();
    expect(wrapper.find('Search input').props().value).to.equal('');
    wrapper.find('Search').props().history.push('/explorer/transaciton/123');
    wrapper.update();
    expect(wrapper.find('Search input')).to.have.props({ value: '123' });
  });

  it('should change input value on change event', () => {
    wrapper.find('Search input').simulate('change', { target: { value: '12025' } });
    expect(wrapper.find('Search input')).to.have.props({ value: '12025' });
    wrapper.find('Search input').simulate('keyup', { which: keyCodes.enter });
    expect(keyAction.visitAndSaveSearchOnEnter).to.have.been.calledWith();
  });

  it('should change value on keyup event', () => {
    wrapper.find('Search input').simulate('keyup', { which: keyCodes.enter, target: { value: '999' } });
    expect(wrapper.find('Search input')).to.have.props({ value: '999' });
    wrapper.find('.search-bar-button').first().simulate('click');
    expect(keyAction.visitAndSaveSearch).to.have.been.calledWith();
  });

  it('should render Search', () => {
    expect(wrapper).to.have.descendants('.search-bar-input');
  });
});

