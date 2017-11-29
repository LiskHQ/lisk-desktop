import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Parallaxer from './index';

describe('Parallaxer', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Parallaxer className='parent'>
      <div className='child'>Child 1</div>
      <div className='child'>Child 2</div>
    </Parallaxer>);
  });

  it('should mount its children', () => {
    expect(wrapper.find('.child').length).to.be.equal(2);
  });
});
