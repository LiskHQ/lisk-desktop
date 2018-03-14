import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import { stub, spy } from 'sinon';
import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import { mountWithContext } from '../../../test/utils/mountHelpers';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';

import accounts from '../../../test/constants/accounts';
import i18n from '../../i18n';
import Search from './index';

describe('SearchBar', () => {
  let wrapper;
  let account;
  let peers;
  let store;
  let history;
  let props;
  let options;
  let localStorageStub;

    // Mocking store
  beforeEach(() => {
    localStorageStub = stub(localStorage, 'getItem');
    localStorageStub.withArgs('searches').returns([]);

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
    wrapper = mount(
      <Provider store={{searchItem: '11'}}>
        <Router>
          <Search {...props} />
        </Router>
      </Provider>, options
    );
    });


    afterEach(() => {
        localStorageStub.restore();
    });

    it('should call getSearchItem on componentWillReceiveProps', () => {
      wrapper.find('Search').props().history.push('/explorer/');
      wrapper.update();
      expect(wrapper.find('Search input').props().value).to.equal('');
      wrapper.find('Search').props().history.push('/explorer/transaciton/123');
      wrapper.update();
      expect(wrapper.find('Search input').props().value).to.equal('123');
    });

    it('should change input value on change event', () => {
      wrapper.find('Search input').simulate('change', { target: { value: '12025' } });
      expect(wrapper.find('Search input').props().value).to.equal('12025');
    });

    it('should change value on "change" event', () => {
      wrapper.find('Search input').simulate('change', { target: { value: '12025' } });
      expect(wrapper.find('Search input').props().value).to.equal('12025');
    });

    it('should change value on keyup event', () => {
      wrapper.find('Search input').simulate('keyup', {which: 13, target: { value: '999' }});
      expect(wrapper.find('Search input').props().value).to.equal('999');
    });

    it('should render Search', () => {
      expect(wrapper.find('.search-bar-input')).to.have.lengthOf(1);
    });
});

