import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import SecondPassphraseInput from './secondPassphraseInput';


describe('SecondPassphraseInput', () => {
  let wrapper;
  let props;
  const passphrase = 'recipe bomb asset salon coil symbol tiger engine assist pact pumpkin visit';

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

  it('should call props.onChange when input value changes', () => {
    props.hasSecondPassphrase = true;
    wrapper = mount(<SecondPassphraseInput {...props} />);
    wrapper.find('.second-passphrase input').simulate('change', { target: { value: passphrase } });
    expect(props.onChange).to.have.been.calledWith(passphrase);
  });

  it('should call props.onError(\'Required\') when input value changes to \'\'', () => {
    props.hasSecondPassphrase = true;
    wrapper = mount(<SecondPassphraseInput {...props} />);
    wrapper.find('.second-passphrase input').simulate('change', { target: { value: '' } });
    expect(props.onError).to.have.been.calledWith('Required', '');
  });

  it('should call props.onError(\'Invalid passphrase\') when input value changes to \'test\'', () => {
    props.hasSecondPassphrase = true;
    wrapper = mount(<SecondPassphraseInput {...props} />);
    wrapper.find('.second-passphrase input').simulate('change', { target: { value: 'test' } });
    expect(props.onError).to.have.been.calledWith('Invalid passphrase', 'test');
  });
});
