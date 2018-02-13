import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import MultiStep from './index';

describe('MultiStep', () => {
  let wrapper;

  const Child1 = ({ children, nextStep, prevStep }) => (<div className='child1'
    onClick={() => nextStep({ value: 'called from child1' })}
    onMouseEnter={data => prevStep(data.config)}>{children}</div>);
  const Child2 = ({ children, nextStep, prevStep }) => (<div className='child2'
    onClick={() => nextStep({ value: 'called from child2' })}
    onMouseEnter={data => prevStep(data.config)}>{children}</div>);
  const Child3 = ({ children, prevStep }) => (<div className='child3'
    onMouseEnter={data => prevStep(data.config)}>{children}</div>);

  beforeEach(() => {
    wrapper = mount(<MultiStep>
      <Child1 title='Title 1' />
      <Child2 title='Title 2' />
      <Child3 title='Title 3' />
    </MultiStep>);
  });

  it('Renders the first child initially', () => {
    expect(wrapper.find(Child1)).to.have.lengthOf(1);
  });

  it('Should remove the current child when cb called and render next child', () => {
    let child1 = wrapper.find('Child1');
    expect(typeof child1.props().nextStep).to.be.equal('function');
    child1.simulate('click');

    wrapper.update();

    child1 = wrapper.find('Child1');
    const child2 = wrapper.find('Child2');
    expect(child1).to.have.lengthOf(0);
    expect(child2).to.have.lengthOf(1);
  });

  it('should render next child with properties when nextStep called', () => {
    // Should have cb as property
    const child1 = wrapper.find('Child1');
    expect(typeof child1.props().nextStep).to.be.equal('function');
    child1.simulate('click');

    // Should pass value to next child
    const child2 = wrapper.find('Child2');
    expect(child2.props().value).to.be.equal('called from child1');
    child2.simulate('click');

    // should pass value to next child
    const child3 = wrapper.find('Child3');
    expect(child3.props().value).to.be.equal('called from child2');
  });

  it('should render previous child with properties when prevStep called', () => {
    // FF to steps 3
    const child1 = wrapper.find('Child1');
    expect(typeof child1.props().nextStep).to.be.equal('function');
    child1.simulate('click');
    let child2 = wrapper.find('Child2');
    child2.simulate('click');
    const child3 = wrapper.find('Child3');

    // Now prev to step 2
    child3.simulate('mouseEnter', { config: { jump: 1 } });
    child2 = wrapper.find('Child2');
    expect(child2.props().value).to.be.equal('called from child1');
  });

  it('should allow to skip multiple steps backward', () => {
    // FF to steps 3
    let child1 = wrapper.find('Child1');
    expect(typeof child1.props().nextStep).to.be.equal('function');
    child1.simulate('click');
    const child2 = wrapper.find('Child2');
    child2.simulate('click');
    const child3 = wrapper.find('Child3');

    // Now prev to step 2
    child3.simulate('mouseEnter', { config: { reset: true } });
    child1 = wrapper.find('Child1');
    expect(child1).to.have.lengthOf(1);
  });

  it('should allow to reset to first step', () => {
    // FF to steps 3
    let child1 = wrapper.find('Child1');
    expect(typeof child1.props().nextStep).to.be.equal('function');
    child1.simulate('click');
    const child2 = wrapper.find('Child2');
    child2.simulate('click');
    const child3 = wrapper.find('Child3');

    // Now prev to step 2
    child3.simulate('mouseEnter', { config: { reset: true, jump: 2 } });
    child1 = wrapper.find('Child1');
    expect(child1).to.have.lengthOf(1);
  });
});
