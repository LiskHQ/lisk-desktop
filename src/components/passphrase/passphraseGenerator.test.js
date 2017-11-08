import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { mount } from 'enzyme';
import PassphraseGenerator from './passphraseGenerator';
import * as passphraseUtil from '../../utils/passphrase';


describe('PassphraseGenerator', () => {
  describe('seedGenerator', () => {
    const props = {
      changeHandler: () => {},
      t: key => key,
    };

    it('shows an Input fallback if this.isTouchDevice()', () => {
      const wrapper = mount(<PassphraseGenerator {...props} agent='ipad'/>);
      expect(wrapper.find('Input.touch-fallback textarea')).to.have.lengthOf(1);
    });

    it('shows at least some progress on pressing input if this.isTouchDevice()', () => {
      const wrapper = mount(<PassphraseGenerator {...props} agent='ipad'/>);
      wrapper.find('Input.touch-fallback textarea').simulate('change', { target: { value: 'random key presses' } });
      expect(wrapper.find('ProgressBar').props().value).to.be.at.least(1);
    });

    it('removes mousemove event listener in componentWillUnmount', () => {
      const wrapper = mount(<PassphraseGenerator {...props}/>);
      const documentSpy = spy(document, 'removeEventListener');
      wrapper.unmount();
      expect(documentSpy).to.have.be.been.calledWith('mousemove');
      documentSpy.restore();
    });

    it('should call generateSeed for every event triggered', () => {
      const generateSeedSpy = spy(passphraseUtil, 'generateSeed');
      const wrapper = mount(<PassphraseGenerator {...props} agent='ipad'/>);
      wrapper.find('Input.touch-fallback textarea').simulate('change', { target: { value: 'random key presses' } });

      expect(generateSeedSpy.callCount).to.be.equal(1);
    });

    it('should call generatePassphrase after enough event passed', () => {
      const generatePassphraseSpy = spy(passphraseUtil, 'generatePassphrase');
      const wrapper = mount(<PassphraseGenerator {...props} agent='ipad'/>);
      const input = wrapper.find('Input.touch-fallback textarea');
      for (let i = 0; i < 101; i++) {
        input.simulate('change', { target: { value: 'random key presses' } });
      }

      expect(generatePassphraseSpy.callCount).to.be.equal(1);
    });
  });
});
