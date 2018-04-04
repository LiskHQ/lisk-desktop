import React from 'react';
import { expect } from 'chai';
import { spy, useFakeTimers } from 'sinon';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import Form from './form';
import i18n from '../../../i18n';
import accounts from '../../../../test/constants/accounts';


describe('Passphrase: Confirm', () => {
  let wrapper;
  let clock;
  const account = accounts.delegate;
  const props = {
    missing: [0, 1],
    wordOptions: [['first', 'second', 'third'], ['forth', 'fifth', 'sixth']],
    words: ['first', 'forth', 'other', 'words'],
    answers: [[], []],
    selectedFieldset: 0,
    trials: 0,
    onWordSelected: () => {},
    selectFieldset: () => {},
    formStatus: 'clean',
  };

  const fakeStore = configureStore();
  const store = fakeStore({
    account,
  });

  const options = {
    context: { i18n, store },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
      store: PropTypes.object.isRequired,
    },
  };

  beforeEach(() => {
    spy(props, 'onWordSelected');
    spy(props, 'selectFieldset');
    wrapper = mount(<Form {...props} />, options);
    clock = useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date', 'setInterval'],
    });
  });

  afterEach(() => {
    clock.restore();
    props.onWordSelected.restore();
    props.selectFieldset.restore();
  });

  it('should select the fieldset if selectedFieldset is not -1', () => {
    const fieldset = wrapper.find('fieldset').at(0).find('span');
    expect(fieldset.props().className).to.include('selected');
  });

  it('should call selectFieldset when fieldset clicked', () => {
    const fieldset = wrapper.find('fieldset').at(0).find('span');
    fieldset.simulate('click');
    wrapper.update();

    expect(props.selectFieldset).to.have.been.calledWith();
  });
});
