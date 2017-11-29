import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Parallax from './index';

describe.only('Parallax', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Parallax className='parent'>
      <div className='child'>Child 1</div>
      <div className='child'>Child 2</div>
    </Parallax>);
  });

  it('should mount its children', () => {
    expect(wrapper.find('.child').length).to.be.equal(2);
  });
});
