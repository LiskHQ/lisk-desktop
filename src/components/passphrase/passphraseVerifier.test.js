import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { mount, shallow } from 'enzyme';
import PassphraseVerifier from './passphraseVerifier';


describe('PassphraseVerifier', () => {
  const props = {
    updateAnswer: () => {},
    passphrase: 'survey stereo pool fortune oblige slight gravity goddess mistake sentence anchor pool',
    t: key => key,
  };

  describe('componentDidMount', () => {
    it('should call updateAnswer with "false"', () => {
      const spyFn = spy(props, 'updateAnswer');
      mount(<PassphraseVerifier {...props} />);
      expect(spyFn).to.have.been.calledWith();
      props.updateAnswer.restore();
    });
  });

  describe('changeHandler', () => {
    it('call updateAnswer with received value', () => {
      const spyFn = spy(props, 'updateAnswer');
      const value = 'sample';
      const wrapper = shallow(<PassphraseVerifier {...props} />);
      wrapper.instance().changeHandler(value);
      expect(spyFn).to.have.been.calledWith();
      props.updateAnswer.restore();
    });
  });

  describe('hideRandomWord', () => {
    it('should break passphrase, hide a word and store all in state', () => {
      const wrapper = shallow(<PassphraseVerifier {...props} />);

      const randomIndex = 0.6;
      const expectedValues = {
        passphraseParts: [
          'survey stereo pool fortune oblige slight ',
          ' goddess mistake sentence anchor pool',
        ],
        missing: 'gravity',
        answer: '',
      };
      const spyFn = spy(wrapper.instance(), 'setState');

      wrapper.instance().hideRandomWord(randomIndex);
      expect(spyFn).to.have.been.calledWith(expectedValues);
    });
  });
});
