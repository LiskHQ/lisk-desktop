import React from 'react';
import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import { spy, stub, useFakeTimers } from 'sinon';
import { mountWithContext } from '../../../test/unit-test-utils/mountHelpers';
import AutoSuggest from './index';
import styles from './autoSuggest.css';
import * as searchActions from './../searchResult/keyAction';
import localJSONStorageUtil from './../../utils/localJSONStorage';
import routes from '../../constants/routes';
import keyCodes from './../../constants/keyCodes';
import mockSearchResults from './searchResults.mock';

describe('AutoSuggest', () => {
  let wrapper;
  let props;
  let results;
  let localStorageStub;
  let submitSearchSpy;
  let submitSearchAnythingSpy;
  let saveSearchSpy;
  let clock;

  beforeEach(() => {
    localStorageStub = stub(localJSONStorageUtil, 'get');
    localStorageStub.withArgs('searches', []).returns([]);
    results = { ...mockSearchResults };
    props = {
      t: key => key,
      history: {
        push: spy(),
      },
      results,
      searchSuggestions: spy(),
      searchClearSuggestions: spy(),
    };

    const store = configureMockStore([])({
      search: {
        suggestions: {
          delegates: [],
          addresses: [],
          transactions: [],
        },
      },
    });
    clock = useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date', 'setInterval'],
    });

    submitSearchSpy = spy(AutoSuggest.prototype, 'submitSearch');
    submitSearchAnythingSpy = spy(AutoSuggest.prototype, 'submitAnySearch');
    saveSearchSpy = spy(searchActions, 'saveSearch');
    wrapper = mountWithContext(<AutoSuggest {...props} />, { storeState: store });
    wrapper.update();
  });

  afterEach(() => {
    localStorageStub.restore();
    submitSearchSpy.restore();
    submitSearchAnythingSpy.restore();
    saveSearchSpy.restore();
    clock.restore();
  });

  it('should render a row for each entity found {addresses,delegates,transactions}', () => {
    expect(wrapper).to.have.exactly(3).descendants('.addresses-result');
    expect(wrapper).to.have.exactly(3).descendants('.delegates-result');
    expect(wrapper).to.have.exactly(3).descendants('.transactions-result');
  });

  it('should not render any row for not found entities {delegates}', () => {
    const partialResults = {
      ...results,
      addresses: [],
      transactions: [],
    };
    wrapper.setProps({ results: partialResults });
    wrapper.update();
    expect(wrapper).to.have.exactly(0).descendants('.addresses-result');
    expect(wrapper).to.have.exactly(3).descendants('.delegates-result');
    expect(wrapper).to.have.exactly(0).descendants('.transactions-result');
  });

  it('should show recent searches when focusing on input and no search value has been entered yet', () => {
    localStorageStub.withArgs('searches', []).returns([
      { id: '111L', searchTerm: 'pepe' },
      { id: '111', searchTerm: '' },
    ]);
    wrapper.setProps({
      results: {
        delegates: [],
        addresses: [],
        transactions: [],
      },
    });
    wrapper.update();
    const autosuggestInput = wrapper.find('.autosuggest-input').find('input').first();
    autosuggestInput.simulate('focus');
    expect(wrapper).to.have.exactly(1).descendants('.addresses-result');
    expect(wrapper).to.have.exactly(1).descendants('.transactions-result');
    expect(props.searchSuggestions).not.to.have.been.calledWith();
  });

  it('should show autosuggest on search input change, show suggestion, and hide it on blur', () => {
    let autosuggestDropdown = wrapper.find('.autosuggest-dropdown').first();
    const autosuggestInput = wrapper.find('.autosuggest-input').find('input').first();
    expect(autosuggestDropdown).not.to.have.className(styles.show);
    autosuggestInput.simulate('focus');
    autosuggestInput.simulate('change', { target: { value: 'peter' } });
    clock.tick(300);
    wrapper.setProps({
      results: {
        delegates: [results.delegates[0]],
        addresses: [],
        transactions: [],
      },
    });
    wrapper.update();
    expect(wrapper.find('.autosuggest-placeholder')).to.have.value('peterpan');

    expect(props.searchSuggestions).to.have.been.calledWith();
    autosuggestDropdown = wrapper.find('.autosuggest-dropdown').first();
    expect(autosuggestDropdown).to.have.className(styles.show);

    autosuggestInput.simulate('blur');
    wrapper.update();
    autosuggestDropdown = wrapper.find('.autosuggest-dropdown').first();
    expect(autosuggestDropdown).not.to.have.className(styles.show);
  });

  it('should allow to click on {addresss} suggestion and redirect to its "explorer/accounts" page', () => {
    wrapper.find('.addresses-result').first().simulate('mousedown');
    expect(props.history.push).to.have.been
      .calledWith(`${routes.accounts.pathPrefix}${routes.accounts.path}/${results.addresses[0].address}`);
  });

  it('should allow to click on {delegate} suggestion and redirect to its "explorer/accounts" page', () => {
    wrapper.find('.delegates-result').first().simulate('mousedown');
    expect(props.history.push).to.have.been
      .calledWith(`${routes.accounts.pathPrefix}${routes.accounts.path}/${results.delegates[0].account.address}`);
  });

  it('should allow to click on {transaction} suggestion and redirect to its "explorer/transactions" page', () => {
    wrapper.find('.transactions-result').first().simulate('mousedown');
    expect(props.history.push).to.have.been
      .calledWith(`${routes.transactions.pathPrefix}${routes.transactions.path}/${results.transactions[0].id}`);
  });

  it('should not redirect to search result page on keyboard event {enter} if no results', () => {
    const autosuggestInput = wrapper.find('.autosuggest-input').find('input').first();
    autosuggestInput.simulate('change', { target: { value: 'notExistingDelegate' } });
    autosuggestInput.simulate('keyDown', {
      keyCode: keyCodes.enter,
      which: keyCodes.enter,
    });
    expect(saveSearchSpy).not.to.have.been.calledWith();
    expect(props.history.push).not.to.have.been.calledWith();
  });

  it('should update placeholder on events {arrowUp/arrowDown} and redirect to entity page on keyboard event {tab}', () => {
    const autosuggestInput = wrapper.find('.autosuggest-input').find('input').first();

    wrapper.setProps({
      results: {
        delegates: results.delegates,
        addresses: [results.addresses[0]],
        transactions: [results.transactions[0]],
      },
    });
    wrapper.update();
    autosuggestInput.simulate('change', { target: { value: 'peter' } });
    autosuggestInput.simulate('keyDown', {
      keyCode: keyCodes.arrowDown,
      which: keyCodes.arrowDown,
    });
    autosuggestInput.simulate('keyDown', {
      keyCode: keyCodes.arrowDown,
      which: keyCodes.arrowDown,
    });
    wrapper.update();
    // first result of transactions mock data
    expect(wrapper.find('.autosuggest-placeholder')).to.have.value(results.delegates[2].username);
    autosuggestInput.simulate('keyDown', {
      keyCode: keyCodes.arrowUp,
      which: keyCodes.arrowUp,
    });
    autosuggestInput.simulate('keyDown', {
      keyCode: keyCodes.tab,
      which: keyCodes.tab,
    });
    expect(submitSearchSpy).to.have.been.calledWith();
  });

  it('should show recent searches and close dropdown on keyboard event {escape}', () => {
    const autosuggestInput = wrapper.find('.autosuggest-input').find('input').first();
    localStorageStub.withArgs('searches', []).returns([
      { searchTerm: 'genesis_11', id: '1478505779553195737L' },
      { searchTerm: '8500285156990763245', id: '8500285156990763245' },
      { searchTerm: '10881167371402274308L', id: '10881167371402274308L' },
    ]);
    wrapper.setProps({
      results: {
        delegates: [],
        addresses: [],
        transactions: [],
      },
    });
    wrapper.update();

    autosuggestInput.simulate('change');

    autosuggestInput.simulate('keyDown', {
      keyCode: keyCodes.arrowDown,
      which: keyCodes.arrowDown,
    });
    expect(wrapper.find('.autosuggest-placeholder')).to.have.value('genesis_11');

    autosuggestInput.simulate('keyDown', {
      keyCode: keyCodes.escape,
      which: keyCodes.escape,
    });
    expect(submitSearchSpy).not.to.have.been.calledWith();
    const autosuggestDropdown = wrapper.find('.autosuggest-dropdown').first();
    expect(autosuggestDropdown).not.to.have.className(styles.show);
  });

  it('should call searchClearSuggestions when resetSearch is triggered', () => {
    const autosuggestInput = wrapper.find('.autosuggest-input').find('input').first();

    wrapper.setState({
      value: 'test',
      placeholder: 'test',
    });
    wrapper.update();
    autosuggestInput.simulate('change', { target: { value: 'peter' } });
    wrapper.update();

    wrapper.find('.autosuggest-btn-close').at(0).simulate('click');

    expect(props.searchClearSuggestions).to.have.been.calledWith();
  });
});
