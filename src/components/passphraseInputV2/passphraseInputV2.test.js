import React from 'react';
import PropTypes from 'prop-types';
import { spy } from 'sinon';
import { expect } from 'chai';
import { mount } from 'enzyme';
import i18n from '../../i18n';
import PassphraseInputV2 from './passphraseInputV2';
import keyCodes from '../../constants/keyCodes';
import accounts from '../../../test/constants/accounts';

describe('V2 passphraseInput validations, rendering and functionalities', () => {
  let wrapper;
  const options = {
    context: { i18n },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
    },
  };

  const props = {
    onFill: spy(),
    inputsLength: 12,
  };

  beforeEach(() => {
    wrapper = mount(<PassphraseInputV2 {...props}/>, options);
  });

  it('Should render as many input as the amount passed to prop inputsLength', () => {
    expect(wrapper.find('.inputs')).to.have.exactly(props.inputsLength).descendants('input');
  });

  it('Should be able to toggle show/hide password', () => {
    expect(wrapper.find('input').first()).to.have.prop('type', 'password');
    wrapper.find('.showPassphrase input').simulate('change');
    expect(wrapper.find('input').first()).to.have.prop('type', 'text');
    wrapper.find('.showPassphrase input').simulate('change');
    expect(wrapper.find('input').first()).to.have.prop('type', 'password');
  });

  it('Should call props.onFill with passphrase and empty error if passphrase is valid', () => {
    const { passphrase } = accounts.genesis;
    const clipboardData = {
      getData: () => passphrase,
    };
    wrapper.find('input').first().simulate('paste', { clipboardData });
    expect(wrapper.props().onFill).to.have.been.calledWith(passphrase, '');
  });

  it('Should call props.onFill with error="Required" if an empty passphrase is entered', () => {
    const passphrase = '';
    const clipboardData = {
      getData: () => passphrase,
    };
    wrapper.find('input').first().simulate('paste', { clipboardData });
    expect(wrapper.props().onFill).to.have.been.calledWith(passphrase, 'Required');
  });

  const ONLY_ONE_WORD_ERROR = 'Passphrase should have 12 words, entered passphrase has 1';
  it(`should call props.onFill with error="${ONLY_ONE_WORD_ERROR}" if an "test" passphrase is entered`, () => {
    const passphrase = 'test';
    wrapper.find('input').first().simulate('change', { target: { value: passphrase, dataset: { index: 0 } } });
    wrapper.setProps({ value: passphrase });
    expect(wrapper.props().onFill).to.have.been.calledWith(passphrase, ONLY_ONE_WORD_ERROR);
  });

  const NOT_VALID_ERROR = 'Passphrase is not valid';
  it(`should call props.onFill with error="${NOT_VALID_ERROR}" if an otherwise invalid passphrase is entered`, () => {
    const passphrase = 'stock wagon borrow episode laundry kitten salute link globe zero feed marble';
    const clipboardData = {
      getData: () => passphrase,
    };
    wrapper.find('input').first().simulate('paste', { clipboardData });
    expect(wrapper.props().onFill).to.have.been.calledWith(passphrase, NOT_VALID_ERROR);
  });
});

describe('V2 passphraseInput change focus with keypresses', () => {
  let wrapper;
  let firstField;
  let nextField;
  const options = {
    context: { i18n },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
    },
  };

  const props = {
    onFill: spy(),
    inputsLength: 12,
  };

  beforeEach(() => {
    wrapper = mount(<PassphraseInputV2 {...props}/>, options);
    firstField = wrapper.find('input').first();
    nextField = wrapper.find('input').at(1);
  });

  it('Should remove selected class from inputs on blur', () => {
    firstField.simulate('click');
    expect(firstField).to.have.className('selected');
    firstField.simulate('blur');
    expect(firstField).to.not.have.className('selected');
  });

  it('should focus next element on space press', () => {
    firstField.simulate('click');
    firstField.simulate('keyDown', {
      keyCode: keyCodes.space,
      which: keyCodes.space,
    });
    expect(nextField).to.have.className('selected');
  });

  it('should focus next element on arrow right and previous element on left press', () => {
    firstField.simulate('click');
    expect(firstField).to.have.className('selected');
    firstField.simulate('keyDown', {
      keyCode: keyCodes.arrowRight,
      which: keyCodes.arrowRight,
    });
    expect(nextField).to.have.className('selected');
    nextField.simulate('keyDown', {
      keyCode: keyCodes.arrowLeft,
      which: keyCodes.arrowLeft,
    });
    expect(firstField).to.have.className('selected');
  });

  it('should focus previous element on backspace press', () => {
    firstField.simulate('click');
    expect(firstField).to.have.className('selected');
    firstField.simulate('keyDown', {
      keyCode: keyCodes.arrowRight,
      which: keyCodes.arrowRight,
    });
    expect(nextField).to.have.className('selected');
    nextField.simulate('keyDown', {
      keyCode: keyCodes.delete,
      which: keyCodes.delete,
    });
    expect(firstField).to.have.className('selected');
  });
});
