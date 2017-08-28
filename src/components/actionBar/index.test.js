import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import ActionBar from './index';
import store from '../../store';
// import * as accountApi from '../../utils/api/account';


describe('ActionBar', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      secondaryButton: {
        label: 'Test cancel',
        onClick: sinon.spy(),
      },
      primaryButton: {
        label: 'Test confirm',
        disabled: false,
        onClick: sinon.spy(),
      },
    };
    wrapper = mount(<Provider store={store}><ActionBar {...props} /></Provider>);
  });

  it('renders two Button components', () => {
    expect(wrapper.find('Button')).to.have.length(2);
  });

  it('binds props.secondaryButton.label to first button label', () => {
    expect(wrapper.find('Button').at(0).props().label).to.equal(props.secondaryButton.label);
  });

  it('binds props.primaryButton.label to second button label', () => {
    expect(wrapper.find('Button').at(1).props().label).to.equal(props.primaryButton.label);
  });

  it('binds props.primaryButton.disabled to second button disabled', () => {
    expect(wrapper.find('Button').at(1).props().disabled).to.equal(props.primaryButton.disabled);
  });

  it('binds props.secondaryButton.onClick to first button onClick', () => {
    wrapper.find('Button').at(0).simulate('click');
    expect(props.secondaryButton.onClick).to.have.been.calledWith();
  });

  it('binds props.primaryButton.onClick to second button onClick', () => {
    wrapper.find('Button').at(1).simulate('click');
    expect(props.primaryButton.onClick).to.have.been.calledWith();
  });
});
