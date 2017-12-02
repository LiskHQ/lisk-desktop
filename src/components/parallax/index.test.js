import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Parallaxer from './index';

describe('Parallaxer', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Parallaxer className='parent' originX='0px'>
      <div className='child'>Child 1</div>
      <div className='child'>Child 2</div>
    </Parallaxer>);
  });

  it('should mount its children', () => {
    expect(wrapper.find('.child')).to.have.lengthOf(2);
  });

  it('should run Parallax on its children', () => {
    const child0Html = wrapper.find('.child').at(0).html();
    const child1Html = wrapper.find('.child').at(1).html();
    expect(child0Html).to.include('transform: translate3d');
    expect(child1Html).to.include('transform: translate3d');
  });
});
