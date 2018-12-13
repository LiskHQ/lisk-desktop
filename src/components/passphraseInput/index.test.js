import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';

import accounts from '../../../test/constants/accounts';
import i18n from '../../i18n';
import PassphraseInputHOC, { PassphraseInput } from './index';
import keyCodes from './../../constants/keyCodes';

describe('PassphraseInput', () => {
  let wrapper;
  let props;
  let onChangeSpy;

  describe('with HOC', () => {
    beforeEach(() => {
      props = {
        error: '',
        value: '',
        onChange: key => key,
        i18n,
      };
      onChangeSpy = spy(props, 'onChange');
      wrapper = mount(<PassphraseInputHOC {...props} />);
    });

    afterEach(() => {
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
      wrapper.setProps({ value: passphrase });
      expect(wrapper.props().onChange).to.have.been.calledWith(passphrase, ONLY_ONE_WORD_ERROR);
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


  describe('without HOC', () => {
    beforeEach(() => {
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

    afterEach(() => {
      onChangeSpy.restore();
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

    it('should focus input on click', () => {
      expect(wrapper.find('input')).to.have.length(1);
      expect(wrapper.state('isFocused')).to.equal(false);
      wrapper.find('input').first().simulate('click');
      expect(wrapper.state('isFocused')).to.equal(true);
      expect(wrapper.find('input')).to.have.length(12);
    });

    it('should handle paste a passphrase', () => {
      expect(wrapper.state('isFocused')).to.equal(false);
      expect(wrapper.find('input')).to.have.length(1);
      const passphrase = 'stock wagon borrow episode laundry kitten salute link globe zero feed marble';
      wrapper.find('input').first().simulate('change', { target: { value: passphrase } });
      expect(wrapper.state('isFocused')).to.equal(true);
      expect(wrapper.find('input')).to.have.length(12);
      expect(wrapper.props().onChange).to.have.been.calledWith(passphrase);
    });

    it('should focus next element on space press', () => {
      expect(wrapper.state('focus')).to.equal(0);
      wrapper.find('input').first().simulate('click');
      wrapper.find('input').first().simulate('keyDown', {
        keyCode: keyCodes.space,
        which: keyCodes.space,
      });
      expect(wrapper.state('focus')).to.equal(1);
    });

    it('should focus next element on arrow right and previous element on left press', () => {
      expect(wrapper.state('focus')).to.equal(0);
      wrapper.find('input').first().simulate('click');
      wrapper.find('input').first().simulate('keyDown', {
        keyCode: keyCodes.arrowRight,
        which: keyCodes.arrowRight,
      });
      expect(wrapper.state('focus')).to.equal(1);
      wrapper.find('input').at(1).simulate('keyDown', {
        keyCode: keyCodes.arrowLeft,
        which: keyCodes.arrowLeft,
      });
      expect(wrapper.state('focus')).to.equal(0);
    });

    it('should focus previous element on backspace press', () => {
      expect(wrapper.state('focus')).to.equal(0);
      wrapper.find('input').first().simulate('click');
      wrapper.find('input').first().simulate('keyDown', {
        keyCode: keyCodes.arrowRight,
        which: keyCodes.arrowRight,
      });
      expect(wrapper.state('focus')).to.equal(1);
      wrapper.find('input').at(1).simulate('keyDown', {
        keyCode: keyCodes.delete,
        which: keyCodes.delete,
      });
      expect(wrapper.state('focus')).to.equal(0);
    });

    it('should render partial input correctly on load', () => {
      wrapper.find('input').first().simulate('click');

      expect(wrapper.find('input').at(0).props().shouldfocus).to.equal(1);
      expect(wrapper.find('input').at(0).props().type).to.equal('password');
      expect(wrapper.find('input').at(0).props().placeholder.toLowerCase()).to.equal('start here');
      expect(wrapper.find('input').at(0).props().value).to.equal('');

      expect(wrapper.find('input').at(1).props().shouldfocus).to.equal(0);
      expect(wrapper.find('input').at(1).props().type).to.equal('password');
      expect(wrapper.find('input').at(1).props().placeholder).to.equal('');
      expect(wrapper.find('input').at(0).props().value).to.equal('');
    });

    it('should change focused element on focus and blur', () => {
      wrapper.find('input').first().simulate('click');
      wrapper.find('input').at(1).simulate('focus');
      expect(wrapper.find('input').at(1).props().shouldfocus).to.equal(1);
      wrapper.find('input').at(1).simulate('blur');
      expect(wrapper.find('input').at(1).props().shouldfocus).to.equal(0);
    });
  });
});
