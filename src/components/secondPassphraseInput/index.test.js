import React from 'react';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import SecondPassphraseInputContainer from './index';
import store from '../../store';

chai.use(sinonChai);

describe('SecondPassphraseInputContainer', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Provider store={store}><SecondPassphraseInputContainer /></Provider>);
  });

  it('should render SecondPassphraseInput', () => {
    expect(wrapper.find('SecondPassphraseInput')).to.have.lengthOf(1);
  });
});
