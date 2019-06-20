import React from 'react';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import { spy, useFakeTimers } from 'sinon';
import { mount } from 'enzyme';
import i18n from '../../i18n';
import ConfirmPassphrase from './confirmPassphrase';

describe('V2 Register Process - Confirm Passphrase', () => {
  let wrapper;
  let clock;

  const options = {
    context: { i18n },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
    },
  };

  const props = {
    passphrase: 'barely feature filter inmate exotic sister dog boil crush build canvas latin',
    nextStep: spy(),
  };

  const selectWrongWords = (comp, shouldUpdate = false) => {
    comp.find('ConfirmPassphraseOptions').forEach((optionsHolder) => {
      optionsHolder.find('.option').forEach(option =>
        !props.passphrase.includes(option.text()) && option.find('Button').simulate('click'));
    });
    if (shouldUpdate) {
      comp.find('.buttonsHolder Button').at(1).simulate('click');
      clock.tick(1500);
      comp.update();
    }
  };

  const selectRightWords = (comp) => {
    comp.find('ConfirmPassphraseOptions').forEach((optionsHolder) => {
      optionsHolder.find('.option').forEach(option =>
        props.passphrase.includes(option.text()) && option.find('Button').simulate('click'));
    });
  };

  beforeEach(() => {
    wrapper = mount(<ConfirmPassphrase {...props} />, options);
    clock = useFakeTimers({
      now: new Date(2018, 1, 1),
      toFake: ['setTimeout', 'clearTimeout', 'Date', 'setInterval'],
    });
  });

  afterEach(() => {
    clock.restore();
  });

  it('Should render with two words missing from given passphrase', () => {
    expect(wrapper.find('.word')).to.have.length(12);
    expect(wrapper.find('ConfirmPassphraseOptions')).to.have.length(2);
    expect(wrapper.find('.option')).to.have.length(6);
  });

  it('Should update style based on choices', () => {
    selectWrongWords(wrapper);
    expect(wrapper.find('.answered')).to.have.length(2);

    expect(wrapper.find('.buttonsHolder Button').at(1).prop('disabled')).to.be.equal(false);
    wrapper.find('.buttonsHolder Button').at(1).simulate('click');

    expect(wrapper.find('.hasErrors')).to.have.length(2);
    clock.tick(1500);
    wrapper.update();

    expect(wrapper.find('.answered')).to.have.length(0);

    selectRightWords(wrapper);
    wrapper.find('.buttonsHolder Button').at(1).simulate('click');

    expect(wrapper.find('.isCorrect')).to.have.length(2);
    clock.tick(1500);
    expect(props.nextStep).to.have.been.calledWith({ passphrase: props.passphrase });
  });

  it('Should show error message if user pick wrong words 3 times in a row', () => {
    selectWrongWords(wrapper, true);
    selectWrongWords(wrapper, true);
    selectWrongWords(wrapper, true);

    expect(wrapper.find('.answered')).to.have.length(2);
    expect(wrapper.find('.errorMessage')).to.have.className('showError');
  });
});
