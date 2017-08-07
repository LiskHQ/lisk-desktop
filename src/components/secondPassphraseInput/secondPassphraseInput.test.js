import React from 'react';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import SecondPassphraseInput from './secondPassphraseInput';

chai.use(sinonChai);


describe('SecondPassphraseInput', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      onChange: sinon.spy(),
      onError: sinon.spy(),
    };
  });

  it('should render Input if props.hasSecondPassphrase', () => {
    props.hasSecondPassphrase = true;
    wrapper = mount(<SecondPassphraseInput {...props} />);
    expect(wrapper.find('Input')).to.have.lengthOf(1);
  });

  it('should render null if !props.hasSecondPassphrase', () => {
    props.hasSecondPassphrase = false;
    wrapper = mount(<SecondPassphraseInput {...props} />);
    expect(wrapper.html()).to.equal(null);
  });

  it('should render null if !props.hasSecondPassphrase', () => {
    props.hasSecondPassphrase = false;
    wrapper = mount(<SecondPassphraseInput {...props} />);
    expect(wrapper.html()).to.equal(null);
  });
});
