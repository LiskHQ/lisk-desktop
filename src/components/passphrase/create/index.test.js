import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import PassphraseGenerator from './create';
import * as passphraseUtil from '../../../utils/passphrase';
import i18n from '../../../i18n';


describe('PassphraseGenerator', () => {
  const props = {
    t: key => key,
    prevStep: () => {},
    nextStep: () => {},
  };
  const account = {
    balance: 1000e8,
    passphrase: 'recipe bomb asset salon coil symbol tiger engine assist pact pumpkin visit',
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

  it('shows an Input fallback if this.isTouchDevice()', () => {
    const wrapper = mount(<PassphraseGenerator {...props} agent='ipad' />, options);
    expect(wrapper.find('.touch-fallback textarea')).to.have.lengthOf(1);
  });

  it('shows at least some progress on pressing input if this.isTouchDevice()', () => {
    const wrapper = mount(<PassphraseGenerator {...props} agent='ipad'/>, options);
    wrapper.find('.touch-fallback textarea').simulate('change', { target: { value: 'random key presses' } });
    expect(wrapper.find('ProgressBar').props().value).to.be.at.least(1);
  });

  it('removes mousemove event listener in componentWillUnmount', () => {
    const wrapper = mount(<PassphraseGenerator {...props}/>, options);
    const documentSpy = spy(document, 'removeEventListener');
    wrapper.unmount();
    expect(documentSpy).to.have.be.been.calledWith('mousemove');
    documentSpy.restore();
  });

  it('should call generateSeed for every event triggered', () => {
    const generateSeedSpy = spy(passphraseUtil, 'generateSeed');
    const wrapper = mount(<PassphraseGenerator {...props} agent='ipad'/>, options);
    wrapper.find('.touch-fallback textarea').simulate('change', { target: { value: 'random key presses' } });

    expect(generateSeedSpy.callCount).to.be.equal(1);
  });

  it('should call generatePassphrase after enough event passed', () => {
    const generatePassphraseSpy = spy(passphraseUtil, 'generatePassphrase');
    const wrapper = mount(<PassphraseGenerator {...props} agent='ipad'/>, options);
    const input = wrapper.find('.touch-fallback textarea');
    for (let i = 0; i < 101; i++) {
      input.simulate('change', { target: { value: 'random key presses' } });
    }

    expect(generatePassphraseSpy.callCount).to.be.equal(1);
  });
});
