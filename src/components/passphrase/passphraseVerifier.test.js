import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { mount } from 'enzyme';
import PassphraseVerifier from './passphraseVerifier';


describe('PassphraseVerifier', () => {
  const props = {
    updateAnswer: () => {},
    passphrase: 'survey stereo pool fortune oblige slight gravity goddess mistake sentence anchor pool',
    t: key => key,
  };
  let updateAnswerSpy;

  let wrapper;

  beforeEach(() => {
    updateAnswerSpy = spy(props, 'updateAnswer');
    wrapper = mount(<PassphraseVerifier {...props} randomIndex={0.47} />);
  });

  afterEach(() => {
    updateAnswerSpy.restore();
  });

  it('should initially call updateAnswer with "false"', () => {
    expect(updateAnswerSpy).to.have.been.calledWith(false);
  });

  it('should call updateAnswer every time the input has changed', () => {
    const value = 'sample value';

    updateAnswerSpy.restore();
    wrapper.find('input').simulate('change', { target: { value } });
    expect(updateAnswerSpy.callCount).to.be.equal(2);
  });

  it('should refocus if use blurs the input', () => {
    const focusSpy = spy();
    wrapper.find('input').simulate('blur', {
      nativeEvent: { target: { focus: focusSpy } },
    });

    expect(focusSpy.callCount).to.be.equal(1);
  });

  it('should break passphrase, hide a word and show it', () => {
    const expectedValues = [
      'survey stereo pool fortune oblige ',
      '-----',
      ' gravity goddess mistake sentence anchor pool',
    ];
    const spanTags = wrapper.find('.passphrase-holder span');

    expect(spanTags.at(0).text()).to.be.equal(expectedValues[0]);
    expect(spanTags.at(1).text()).to.be.equal(expectedValues[1]);
    expect(spanTags.at(2).text()).to.be.equal(expectedValues[2]);
  });
});
