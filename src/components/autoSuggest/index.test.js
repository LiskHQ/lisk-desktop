import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { I18nextProvider } from 'react-i18next';
import { spy } from 'sinon';
import AutoSuggest from './index';
import i18n from '../../i18n';

import routes from '../../constants/routes';
import keyCodes from './../../constants/keyCodes';
import mockSearchResults from './searchResults.mock';

describe('AutoSuggest', () => {
  let wrapper;
  let props;
  let results;
  let submitSearchSpy;

  beforeEach(() => {
    results = { ...mockSearchResults };
    props = {
      t: key => key,
      history: {
        push: spy(),
      },
      results,
    };

    submitSearchSpy = spy(AutoSuggest.prototype, 'submitSearch');
    wrapper = mount(<I18nextProvider i18n={i18n}><AutoSuggest {...props} /></I18nextProvider>);
    wrapper.update();
  });

  afterEach(() => {
    submitSearchSpy.restore();
  });

  it('should render a row for each entity found {addresses,delegates,transactions}', () => {
    expect(wrapper.find('.addresses-result')).to.have.lengthOf(3);
    expect(wrapper.find('.addresses-header')).to.have.lengthOf(1);
    expect(wrapper.find('.delegates-result')).to.have.lengthOf(3);
    expect(wrapper.find('.delegates-header')).to.have.lengthOf(1);
    expect(wrapper.find('.transactions-result')).to.have.lengthOf(3);
    expect(wrapper.find('.transactions-header')).to.have.lengthOf(1);
  });

  it('should not render any row for not found entities {delegates}', () => {
    const partialResults = results;
    delete partialResults.addresses;
    delete partialResults.transactions;
    wrapper.setProps({ results: partialResults });
    wrapper.update();
    expect(wrapper.find('.addresses-result')).to.have.lengthOf(0);
    expect(wrapper.find('.addresses-header')).to.have.lengthOf(0);
    expect(wrapper.find('.delegates-result')).to.have.lengthOf(3);
    expect(wrapper.find('.delegates-header')).to.have.lengthOf(1);
    expect(wrapper.find('.transactions-result')).to.have.lengthOf(0);
    expect(wrapper.find('.transactions-header')).to.have.lengthOf(0);
  });

  it('should show autosuggest on focus and hide it on blur', () => {
    let autosuggestDropdown = wrapper.find('.autosuggest-dropdown').first();
    const autosuggestInput = wrapper.find('.autosuggest-input').find('input').first();
    expect(autosuggestDropdown.props().className.match(new RegExp(/ {1}autoSuggest__show__/g))).to.be.equal(null);
    autosuggestInput.simulate('focus');
    wrapper.update();
    autosuggestDropdown = wrapper.find('.autosuggest-dropdown').first();
    expect(autosuggestDropdown.props().className.match(new RegExp(/ {1}autoSuggest__show__/g))).not.to.be.equal(null);

    autosuggestDropdown.simulate('mouseleave');
    wrapper.update();
    autosuggestDropdown = wrapper.find('.autosuggest-dropdown').first();
    expect(autosuggestDropdown.props().className.match(new RegExp(/ {1}autoSuggest__show__/g))).to.be.equal(null);
  });

  it('should allow to click on {addresss} suggestion and redirect to its "explorer/accounts" page', () => {
    wrapper.find('.addresses-result').first().simulate('click');
    expect(props.history.push).to.have.been
      .calledWith(`${routes.accounts.pathPrefix}${routes.accounts.path}/${results.addresses[0].address}`);
  });

  it('should allow to click on {delegate} suggestion and redirect to its "explorer/accounts" page', () => {
    wrapper.find('.delegates-result').first().simulate('click');
    expect(props.history.push).to.have.been
      .calledWith(`${routes.accounts.pathPrefix}${routes.accounts.path}/${results.delegates[0].address}`);
  });

  it('should allow to click on {transaction} suggestion and redirect to its "explorer/transactions" page', () => {
    wrapper.find('.transactions-result').first().simulate('click');
    expect(props.history.push).to.have.been
      .calledWith(`${routes.transactions.pathPrefix}${routes.transactions.path}/${results.transactions[0].id}`);
  });

  it('should redirect to entity page on keyboard event {enter}', () => {
    const autosuggestInput = wrapper.find('.autosuggest-input').find('input').first();

    autosuggestInput.simulate('change');
    autosuggestInput.simulate('keyDown', {
      keyCode: keyCodes.arrowDown,
      which: keyCodes.arrowDown,
    });
    autosuggestInput.simulate('keyDown', {
      keyCode: keyCodes.arrowUp,
      which: keyCodes.arrowUp,
    });
    autosuggestInput.simulate('keyDown', {
      keyCode: keyCodes.enter,
      which: keyCodes.enter,
    });
    expect(submitSearchSpy).to.have.been.calledWith();
  });

  it('should redirect to entity page on keyboard event {tab}', () => {
    const autosuggestInput = wrapper.find('.autosuggest-input').find('input').first();

    autosuggestInput.simulate('change');
    autosuggestInput.simulate('keyDown', {
      keyCode: keyCodes.arrowDown,
      which: keyCodes.arrowDown,
    });
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

  it('should close dropdown on keyboard event {escape}', () => {
    const autosuggestInput = wrapper.find('.autosuggest-input').find('input').first();

    autosuggestInput.simulate('change');
    autosuggestInput.simulate('keyDown', {
      keyCode: keyCodes.escape,
      which: keyCodes.escape,
    });
    expect(submitSearchSpy).not.to.have.been.calledWith();
    const autosuggestDropdown = wrapper.find('.autosuggest-dropdown').first();
    expect(autosuggestDropdown.props().className.match(new RegExp(/ {1}autoSuggest__show__/g))).to.be.equal(null);
  });
});
