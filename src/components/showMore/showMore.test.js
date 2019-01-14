import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { mount } from 'enzyme';
import ShowMore from './index';

describe('notFound', () => {
  const props = {
    text: 'Show More',
    onClick: spy(),
    className: null,
  };

  it('should render a ShowMore', () => {
    const wrapper = mount(<ShowMore {...props} />);
    expect(wrapper.find('.wrapper')).to.have.lengthOf(1);
  });

  it('should render a text Show More', () => {
    const wrapper = mount(<ShowMore {...props} />);
    expect(wrapper.find('span').text()).to.equal('Show More');
  });

  it('should call onClick function', () => {
    const wrapper = mount(<ShowMore {...props} />);
    wrapper.find('.wrapper').simulate('click');
    wrapper.update();
    expect(props.onClick).to.have.been.calledWith();
  });
});
