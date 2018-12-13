import React from 'react';
import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import { spy } from 'sinon';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';

import Bookmark from './index';
import i18n from '../../i18n';
import keyCodes from '../../constants/keyCodes';

describe('Bookmark', () => {
  let wrapper;
  let props;
  const followedAccounts = { accounts: [{ address: '123L', title: 'peter' }, { address: '12345L', title: 'peter2' }] };

  beforeEach(() => {
    props = {
      t: key => key,
      history: {
        push: spy(),
      },
      handleChange: spy(),
      focusReference: spy(),
      followedAccounts: followedAccounts.accounts,
      address: { value: 'peter' },
    };

    const store = configureMockStore([])({
      followedAccounts,
    });

    wrapper = mount(<Bookmark {...props} />, {
      context: { store, i18n },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
      },
    });
  });

  it('should select address account', () => {
    const bookmarkInput = wrapper.find('#bookmark-input').find('input').first();

    bookmarkInput.simulate('change', { target: { value: followedAccounts.accounts[0].title } });
    wrapper.update();
    bookmarkInput.simulate('keyDown', {
      keyCode: keyCodes.arrowDown,
      which: keyCodes.arrowDown,
    });
    wrapper.update();

    bookmarkInput.simulate('keyDown', {
      keyCode: keyCodes.arrowUp,
      which: keyCodes.arrowUp,
    });
    wrapper.update();

    bookmarkInput.simulate('keyDown', {
      keyCode: keyCodes.enter,
      which: keyCodes.enter,
    });
    wrapper.update();

    expect(props.handleChange).to.have.been.calledWith(followedAccounts.accounts[0].address);
  });


  it('should prevent selecting address account that is not in a range', () => {
    const bookmarkInput = wrapper.find('#bookmark-input').find('input').first();

    bookmarkInput.simulate('change', { target: { value: followedAccounts.accounts[0].title } });
    wrapper.update();

    bookmarkInput.simulate('keyDown', {
      keyCode: keyCodes.arrowDown,
      which: keyCodes.arrowDown,
    });
    bookmarkInput.simulate('keyDown', {
      keyCode: keyCodes.enter,
      which: keyCodes.enter,
    });
    wrapper.update();
    expect(props.handleChange).to.have.been.calledWith(followedAccounts.accounts[1].address);

    bookmarkInput.simulate('keyDown', {
      keyCode: keyCodes.arrowDown,
      which: keyCodes.arrowDown,
    });
    bookmarkInput.simulate('keyDown', {
      keyCode: keyCodes.enter,
      which: keyCodes.enter,
    });
    wrapper.update();

    expect(props.handleChange).to.have.been.calledWith(followedAccounts.accounts[1].address);
  });

  it('should display bigAccountVisual', () => {
    props.address = { value: '123456L' };

    const store = configureMockStore([])({
      followedAccounts,
    });

    wrapper = mount(<Bookmark {...props} />, {
      context: { store, i18n },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
      },
    });

    expect(wrapper).to.have.descendants('.bigAccountVisualBookmarkInput');
  });

  it('should display bookmarkList on onFocus', () => {
    expect(wrapper).to.not.have.descendants('.bookmarkList');
    wrapper.find('Input').props().onFocus();
    wrapper.update();

    expect(wrapper).to.have.descendants('.bookmarkList');
  });

  it('should hide bookmarkList on onBlur', () => {
    expect(wrapper).to.not.have.descendants('.bookmarkList');
    wrapper.find('Input').props().onFocus();
    wrapper.update();

    expect(wrapper).to.have.descendants('.bookmarkList');

    wrapper.find('Input').props().onBlur();
    wrapper.update();

    expect(wrapper).to.not.have.descendants('.bookmarkList');
  });
});
