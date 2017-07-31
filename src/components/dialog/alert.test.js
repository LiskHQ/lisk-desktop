import React from 'react';
import chai, { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiEnzyme from 'chai-enzyme';
import Alert from './alert';

chai.use(sinonChai);
chai.use(chaiEnzyme()); // Note the invocation at the end

describe('Alert', () => {
  let wrapper;
  let closeSpy;
  const text = 'some random text';

  beforeEach(() => {
    closeSpy = sinon.spy();
    wrapper = mount(<Alert text={text} closeDialog={closeSpy} />);
  });

  it('renders paragraph with props.text', () => {
    expect(wrapper.find('p').text()).to.equal(text);
  });

  it('renders "Ok" Button', () => {
    expect(wrapper.find('Button').text()).to.equal('Ok');
  });

  it('renders "Ok" Button that calls props.closeDialog on click', () => {
    wrapper.find('Button').simulate('click');
    expect(closeSpy).to.have.been.calledWith();
  });
});
