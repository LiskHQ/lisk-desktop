import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import i18n from '../../i18n';
import PassphraseInputV2 from './passphraseInputV2';
import keyCodes from '../../constants/keyCodes';
import accounts from '../../../test/constants/accounts';

describe('V2 passphraseInput', () => {
  let wrapper;

  const options = {
    context: { i18n },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
    },
  };

  const props = {
    onFill: jest.fn(),
    inputsLength: 12,
    maxInputsLength: 24,
  };

  beforeEach(() => {
    wrapper = mount(<PassphraseInputV2 {...props} />, options);
  });

  describe('Show 24 inputs when needed', () => {
    let firstField;
    let lastField;

    beforeEach(() => {
      firstField = wrapper.find('.inputs input').first();
      lastField = wrapper.find('.inputs input').last();
    });

    it('should show 24 fields on pressing arrow right on 12th field', () => {
      lastField.simulate('keyDown', {
        keyCode: keyCodes.arrowRight,
        which: keyCodes.arrowRight,
      });
      expect(wrapper.find('.inputs')).toContainMatchingElements(props.maxInputsLength, 'input');
    });

    it('should show 24 fields on pressing space on 12th field', () => {
      lastField.simulate('keyDown', {
        keyCode: keyCodes.space,
        which: keyCodes.space,
      });
      expect(wrapper.find('.inputs')).toContainMatchingElements(props.maxInputsLength, 'input');
    });

    it('should show 24 fields on pressing tab on 12th field', () => {
      lastField.simulate('keyDown', {
        keyCode: keyCodes.tab,
        which: keyCodes.tab,
      });
      expect(wrapper.find('.inputs')).toContainMatchingElements(props.maxInputsLength, 'input');
    });

    it('should show 24 fields when pasting a passphrase longer than 12 words', () => {
      const passphrase = 'stomach bunker border grace wool amazing settle sugar journey sleep pole boat apple salon kick';
      const clipboardData = {
        getData: () => passphrase,
      };
      firstField.simulate('paste', { clipboardData });
      expect(wrapper.find('.inputs')).toContainMatchingElements(props.maxInputsLength, 'input');
    });
  });

  describe('validations, rendering and functionalities', () => {
    let firstField;

    beforeEach(() => {
      firstField = wrapper.find('.inputs input').first();
    });

    it('Should render as many input as the amount passed to prop inputsLength', () => {
      expect(wrapper.find('.inputs')).toContainMatchingElements(props.inputsLength, 'input');
    });

    it('Should be able to toggle show/hide password', () => {
      expect(wrapper.find('.inputs input').first()).toHaveProp('type', 'password');
      wrapper.find('.showPassphrase input').simulate('change');
      expect(wrapper.find('.inputs input').first()).toHaveProp('type', 'text');
      wrapper.find('.showPassphrase input').simulate('change');
      expect(wrapper.find('.inputs input').first()).toHaveProp('type', 'password');
    });

    it('Should call props.onFill with passphrase and empty error if passphrase is valid', () => {
      const { passphrase } = accounts.genesis;
      const clipboardData = {
        getData: () => passphrase,
      };
      firstField.simulate('paste', { clipboardData });
      expect(props.onFill).toBeCalledWith(passphrase, '');
    });

    it('Should call props.onFill with error="Required" if an empty passphrase is entered', () => {
      const passphrase = '';
      const target = {
        dataset: { index: 0 },
        value: passphrase,
      };
      firstField.simulate('change', { target });
      expect(props.onFill).toBeCalledWith(passphrase, 'Required');
    });

    const ONLY_ONE_WORD_ERROR = 'Passphrase should have 12 words, entered passphrase has 1';
    it(`should call props.onFill with error="${ONLY_ONE_WORD_ERROR}" if an "test" passphrase is entered`, () => {
      const passphrase = 'test';
      const target = {
        dataset: { index: 0 },
        value: passphrase,
      };
      firstField.simulate('change', { target });
      expect(props.onFill).toBeCalledWith(passphrase, ONLY_ONE_WORD_ERROR);
    });

    const NOT_VALID_ERROR = 'Passphrase is not valid';
    it(`should call props.onFill with error="${NOT_VALID_ERROR}" if an otherwise invalid passphrase is entered`, () => {
      const passphrase = 'stock wagon borrow episode laundry kitten salute link globe zero feed marble';
      const clipboardData = {
        getData: () => passphrase,
      };
      firstField.simulate('paste', { clipboardData });
      expect(props.onFill).toBeCalledWith(passphrase, NOT_VALID_ERROR);
    });
  });

  describe('Change focus with keypresses', () => {
    it('Should remove selected class from inputs on blur', () => {
      wrapper.find('input').first().simulate('click');
      expect(wrapper.find('input').first()).toHaveClassName('selected');
      wrapper.find('input').first().simulate('blur');
      expect(wrapper.find('input').first()).not.toHaveClassName('selected');
    });

    it('should focus next element on space press', () => {
      wrapper.find('input').first().simulate('click');
      wrapper.find('input').first().simulate('keyDown', {
        keyCode: keyCodes.space,
        which: keyCodes.space,
      });
      wrapper.update();
      expect(wrapper.find('input').at(1)).toHaveClassName('selected');
    });

    it('should focus next element on arrow right and previous element on left press', () => {
      wrapper.find('input').first().simulate('click');
      expect(wrapper.find('input').first()).toHaveClassName('selected');
      wrapper.find('input').first().simulate('keyDown', {
        keyCode: keyCodes.arrowRight,
        which: keyCodes.arrowRight,
      });
      expect(wrapper.find('input').at(1)).toHaveClassName('selected');
      wrapper.find('input').at(1).simulate('keyDown', {
        keyCode: keyCodes.arrowLeft,
        which: keyCodes.arrowLeft,
      });
      expect(wrapper.find('input').first()).toHaveClassName('selected');
    });

    it('should focus previous element on backspace press', () => {
      wrapper.find('input').first().simulate('click');
      expect(wrapper.find('input').first()).toHaveClassName('selected');
      wrapper.find('input').first().simulate('keyDown', {
        keyCode: keyCodes.arrowRight,
        which: keyCodes.arrowRight,
      });
      expect(wrapper.find('input').at(1)).toHaveClassName('selected');
      wrapper.find('input').at(1).simulate('keyDown', {
        keyCode: keyCodes.delete,
        which: keyCodes.delete,
      });
      expect(wrapper.find('input').first()).toHaveClassName('selected');
    });
  });
});
