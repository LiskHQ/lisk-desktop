import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import store from '../../store';
import Passphrase from './passphrase';


describe('Passphrase Component', () => {
  let wrapper;
  const clock = sinon.useFakeTimers();

  beforeEach(() => {
    wrapper = mount(<Provider store={store}><Passphrase /></Provider>);
  });

  it('should render 2 buttons', () => {
    expect(wrapper.find('button')).to.have.lengthOf(2);
  });

  it('should initially render InfoParagraph', () => {
    expect(wrapper.find('InfoParagraph')).to.have.lengthOf(1);
  });

  it.skip('should render PassphraseGenerator component if step is equal info', () => {
    wrapper.find('.primary-button').simulate('click');
    clock.tick(100);
    expect(wrapper.find('PassphraseGenerator')).to.have.lengthOf(1);
  });

  it.skip('should render PassphraseVerifier component if step is equal confirm', () => {
    expect(wrapper.find('PassphraseVerifier')).to.have.lengthOf(1);
  });
});
