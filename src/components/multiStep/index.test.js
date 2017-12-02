import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import MultiStep from './index';

describe('Login', () => {
  let wrapper;

  const Child1 = ({ children, cb }) => (<div className='child1'
    onClick={cb.bind(null, { value: 'called from child1' })}>{children}</div>);
  const Child2 = ({ children, cb }) => (<div className='child2'
    onClick={cb.bind(null, { value: 'called from child2' })}>{children}</div>);
  const Child3 = ({ children }) => (<div className='child3'>{children}</div>);

  describe('General', () => {
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
      expect(typeof child1.props().cb).to.be.equal('function');
      child1.simulate('click');

      wrapper.update();

      child1 = wrapper.find('Child1');
      const child2 = wrapper.find('Child2');
      expect(child1).to.have.lengthOf(0);
      expect(child2).to.have.lengthOf(1);
    });

    it('should render next child with properties when cb called', () => {
      // Should have cb as property
      const child1 = wrapper.find('Child1');
      expect(typeof child1.props().cb).to.be.equal('function');
      child1.simulate('click');

      // Should pass value to next child
      const child2 = wrapper.find('Child2');
      expect(child2.props().value).to.be.equal('called from child1');
      child2.simulate('click');

      // should pass value to next child
      const child3 = wrapper.find('Child3');
      expect(child3.props().value).to.be.equal('called from child2');
    });
  });

  describe('Navigation', () => {
    it('Renders a navigation with all the titles', () => {
      const wrapperWithNav = mount(<MultiStep>
        <Child1 title='Title 1' />
        <Child2 title='Title 2' />
        <Child3 title='Title 3' />
      </MultiStep>);

      expect(wrapperWithNav.find('nav')).to.have.lengthOf(1);
      expect(wrapperWithNav.find('li').at(0).text()).to.be.equal('Title 1');
      expect(wrapperWithNav.find('li').at(1).text()).to.be.equal('Title 2');
      expect(wrapperWithNav.find('li').at(2).text()).to.be.equal('Title 3');
    });

    it('Should render no nav if showNav is false', () => {
      const noNavWrapper = mount(<MultiStep showNav={false}>
        <Child1 title='Title 1' />
        <Child2 title='Title 2' />
        <Child3 title='Title 3' />
      </MultiStep>);
      expect(noNavWrapper.find('nav')).to.have.lengthOf(0);
    });

    it('Should render no nav if any title is not defined', () => {
      const noNavWrapper = mount(<MultiStep>
        <Child1 title='Title 1' />
        <Child2 title='Title 2' />
        <Child3 />
      </MultiStep>);
      expect(noNavWrapper.find('nav')).to.have.lengthOf(0);
    });
  });
});
