import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import Form from './form';
import i18n from '../../../i18n';
import accounts from '../../../../test/constants/accounts';


describe('Passphrase: Confirm : Form', () => {
  let wrapper;
  const account = accounts.delegate;
  const props = {
    wordOptions: [['recipe', 'bomb', 'stock'], ['asset', 'salon', 'laundry']],
    words: accounts.delegate.passphrase.split(' '),
    missing: [1, 4],
    answers: [{}, {}],
    formStatus: 'clean',
    trials: 0,
    selectedFieldset: -1,
    onWordSelected: () => {},
    selectFieldset: () => {},
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
  });

  afterEach(() => {
    props.onWordSelected.restore();
    props.selectFieldset.restore();
  });

  it('calls selectFieldset if clicked on ', () => {
    wrapper.find('fieldset span').at(1).simulate('click');
    expect(props.selectFieldset).to.have.been.calledWith(props.missing[0]);
  });
});
