import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';

import accounts from '../../../test/constants/accounts';
import i18n from '../../i18n';
import { PassphraseInput } from './index';

describe('PassphraseInput', () => {
  let wrapper;
  let props;
  let onChangeSpy;
  const keyCodes = {
    arrowRight: 39,
    arrowLeft: 37,
    space: 32,
    delete: 8,
  };

  beforeEach('', () => {
    props = {
      error: '',
      value: '',
      onChange: () => {},
      i18n,
      t: key => key,
    };
    onChangeSpy = spy(props, 'onChange');

    const options = {
      context: { i18n },
      childContextTypes: {
        i18n: PropTypes.object.isRequired,
      },
    };

    wrapper = mount(<PassphraseInput {...props} />, options);
  });

  afterEach('', () => {
    onChangeSpy.restore();
  });

  it('should call props.onChange with error=undefined if a valid passphrase is entered', () => {
    const { passphrase } = accounts.genesis;
    wrapper.find('input').first().simulate('change', { target: { value: passphrase } });
    expect(wrapper.props().onChange).to.have.been.calledWith(passphrase, undefined);
  });

  it('should call props.onChange with error="Required" if an empty passphrase is entered', () => {
    const passphrase = '';
    wrapper.find('input').first().simulate('change', { target: { value: passphrase } });
    expect(wrapper.props().onChange).to.have.been.calledWith(passphrase, 'Required');
  });

  const ONLY_ONE_WORD_ERROR = 'Passphrase should have 12 words, entered passphrase has 1';
  it(`should call props.onChange with error="${ONLY_ONE_WORD_ERROR}" if an "test" passphrase is entered`, () => {
    const passphrase = 'test';
    wrapper.find('input').first().simulate('change', { target: { value: passphrase } });
    expect(wrapper.props().onChange).to.have.been.calledWith(passphrase, ONLY_ONE_WORD_ERROR);
  });

  it('should highlight invalid words if a passphrase with an invalid word is entered', () => {
    const errorMessage = 'Please check the highlighted words';
    let passphrase = 'wagon stock borrow episode laundry kitten salute link globe zero feed marble';
    wrapper.find('input').first().simulate('change', { target: { value: passphrase } });
    expect(wrapper.props().onChange).to.not.have.been.calledWith(passphrase, errorMessage);
    passphrase = 'wagonn stock borrow episode laundry kitten salute link globe zero feed marble';
    wrapper.find('input').first().simulate('change', { target: { value: passphrase } });
    expect(wrapper.state('partialPassphraseError')[0]).to.equal(true);
    expect(wrapper.props().onChange).to.have.been.calledWith(passphrase, errorMessage);
  });

  const NOT_VALID_ERROR = 'Passphrase is not valid';
  it(`should call props.onChange with error="${NOT_VALID_ERROR}" if an otherwise invalid passphrase is entered`, () => {
    const passphrase = 'stock wagon borrow episode laundry kitten salute link globe zero feed marble';
    wrapper.find('input').first().simulate('change', { target: { value: passphrase } });
    expect(wrapper.props().onChange).to.have.been.calledWith(passphrase, NOT_VALID_ERROR);
  });

  it('should allow to change the input field to type="text" and back', () => {
    expect(wrapper.find('input').first().props().type).to.equal('password');
    wrapper.find('input').first().simulate('click');
    wrapper.find('.show-passphrase-toggle').simulate('click');
    expect(wrapper.find('input').first().props().type).to.equal('text');
    wrapper.find('.show-passphrase-toggle').simulate('click');
    expect(wrapper.find('input').first().props().type).to.equal('password');
  });
});
