import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import CountDownTemplate from './countDownTemplate';

describe('countDownTemplate', () => {
  let wrapper;
  const Child = props => <div className='test'>{props.minutes}:{props.seconds}</div>;

  beforeEach(() => {
    const propsMock = {
      minutes: 10,
      seconds: 25,
    };
    wrapper = mount(<CountDownTemplate {...propsMock}><Child/></CountDownTemplate>);
  });

  it('should mount Renderer', () => {
    expect(wrapper).to.have.descendants('Renderer');
  });
});
