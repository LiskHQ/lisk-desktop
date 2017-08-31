import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import AuthInputs from './authInputs';


describe('AuthInputs', () => {
  let wrapper;
  let props;
  const passphrase = 'recipe bomb asset salon coil symbol tiger engine assist pact pumpkin visit';

  beforeEach(() => {
    props = {
      onChange: sinon.spy(),
      secondPassphrase: { },
      hasPassphrase: true,
      passphrase: {
        value: passphrase,
      },
    };
  });

  it('should render Input if props.hasSecondPassphrase', () => {
    props.hasSecondPassphrase = true;
    wrapper = mount(<AuthInputs {...props} />);
    expect(wrapper.find('Input')).to.have.lengthOf(1);
  });

  it('should render null if !props.hasSecondPassphrase', () => {
    props.hasSecondPassphrase = false;
    wrapper = mount(<AuthInputs {...props} />);
    expect(wrapper.html()).to.equal('<span></span>');
  });

  it('should render null if !props.hasSecondPassphrase', () => {
    props.hasSecondPassphrase = false;
    wrapper = mount(<AuthInputs {...props} />);
    expect(wrapper.html()).to.equal('<span></span>');
  });

  it('should call props.onChange when input value changes', () => {
    props.hasSecondPassphrase = true;
    wrapper = mount(<AuthInputs {...props} />);
    wrapper.find('.second-passphrase input').simulate('change', { target: { value: passphrase } });
    expect(props.onChange).to.have.been.calledWith('secondPassphrase', passphrase);
  });

  it('should call props.onChange(\'secondPassphrase\', \'Required\') when input value changes to \'\'', () => {
    props.hasSecondPassphrase = true;
    wrapper = mount(<AuthInputs {...props} />);
    wrapper.find('.second-passphrase input').simulate('change', { target: { value: '' } });
    expect(props.onChange).to.have.been.calledWith('secondPassphrase', '', 'Required');
  });

  it('should call props.onChange(\'secondPassphrase\', \'Invalid passphrase\') when input value changes to \'test\'', () => {
    props.hasSecondPassphrase = true;
    wrapper = mount(<AuthInputs {...props} />);
    wrapper.find('.second-passphrase input').simulate('change', { target: { value: 'test' } });
    expect(props.onChange).to.have.been.calledWith('secondPassphrase', 'test', 'Invalid passphrase');
  });
});
