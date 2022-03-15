import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import Banner from './banner';

describe('Banner', () => {
  let wrapper;

  const props = {
    title: 'Title of the banner',
    children: <p>Some text content here!</p>,
    footer: <button>Action Button</button>,
  };

  beforeEach(() => {
    wrapper = mount(<Banner {...props} />);
  });

  it('Should render with passed props', () => {
    expect(wrapper.find('header .title')).to.have.text(props.title);
    expect(wrapper.find('main')).to.contain(props.children);
    expect(wrapper.find('footer')).to.contain(props.footer);
  });

  it('Should render with close button and call onClose props', () => {
    const newProps = { onClose: spy() };
    wrapper.setProps(newProps);
    wrapper.update();
    expect(wrapper).to.have.descendants('.closeBtn');
    wrapper.find('.closeBtn').simulate('click');
    expect(newProps.onClose).to.have.been.calledWith();
  });
});
