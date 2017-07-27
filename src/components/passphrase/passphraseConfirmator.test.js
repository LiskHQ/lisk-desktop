import React from 'react';
import chai, { expect } from 'chai';
import { spy } from 'sinon';
import sinonChai from 'sinon-chai';
import { mount, shallow } from 'enzyme';
import PassphraseConfirmator from './passphraseConfirmator';

chai.use(sinonChai);

describe('PassphraseConfirmator', () => {
  const props = {
    updateAnswer: () => {},
    passphrase: 'survey stereo pool fortune oblige slight gravity goddess mistake sentence anchor pool',
  };

  describe('componentDidMount', () => {
    it('should call updateAnswer with "false"', () => {
      const spyFn = spy(props, 'updateAnswer');
      mount(<PassphraseConfirmator passphrase={props.passphrase}
        updateAnswer={props.updateAnswer} />);
      expect(spyFn).to.have.been.calledWith();
      props.updateAnswer.restore();
    });
  });

  describe('changeHandler', () => {
    it('call updateAnswer with received value', () => {
      const spyFn = spy(props, 'updateAnswer');
      const value = 'sample';
      const wrapper = shallow(<PassphraseConfirmator passphrase={props.passphrase}
      updateAnswer={props.updateAnswer}/>);
      wrapper.instance().changeHandler(value);
      expect(spyFn).to.have.been.calledWith();
      props.updateAnswer.restore();
    });
  });

  describe('hideRandomWord', () => {
    it('should break passphrase, hide a word and store all in state', () => {
      const wrapper = shallow(<PassphraseConfirmator passphrase={props.passphrase}
      updateAnswer={props.updateAnswer}/>);

      const randomIndex = 0.5;
      const expectedValues = {
        passphraseParts: [
          'survey stereo pool fortune oblige slight',
          'goddess mistake sentence anchor pool',
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
