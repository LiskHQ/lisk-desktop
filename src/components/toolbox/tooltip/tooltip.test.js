import React from 'react';
import { expect } from 'chai';
import { useFakeTimers } from 'sinon';
import { mount } from 'enzyme';
import Tooltip from './tooltip';

describe('Tooltip wrapper', () => {
  let wrapper;
  let clock;

  const props = {
    title: 'Title of the tooltip',
    children: <p>Some text content here!</p>,
    footer: <a href="http://lisk.io" rel="noopener noreferrer" target="_blank">Read more</a>,
  };

  beforeEach(() => {
    wrapper = mount(<Tooltip {...props} />);
    clock = useFakeTimers({
      now: new Date(2018, 1, 1),
      toFake: ['setTimeout', 'clearTimeout'],
    });
  });

  afterEach(() => {
    clock.restore();
  });

  it('Should render the tooltip hidden', () => {
    expect(wrapper.find('.infoIcon')).to.have.length(1);
    expect(wrapper.find('.tooltip.shownTooltip')).to.have.length(0);
  });

  it('Should render with passed props', () => {
    expect(wrapper.find('header .title')).to.have.text(props.title);
    expect(wrapper.find('main')).to.contain(props.children);
    expect(wrapper.find('footer')).to.contain(props.footer);
  });

  it('Should show the tooltip on click', () => {
    expect(wrapper.find('.tooltip.shownTooltip')).to.have.length(0);
    wrapper.find('.infoIcon').simulate('click');
    expect(wrapper.find('.tooltip')).to.have.className('shownTooltip');
  });

  it('Should show modal when mouse enter and close after 1 second when mouse leave', () => {
    wrapper.simulate('mousemove');
    expect(wrapper.find('.tooltip')).to.have.className('shownTooltip');
    wrapper.simulate('mouseleave');
    clock.tick(1000);
    expect(wrapper.find('.tooltip')).not.to.have.className('shownTooltip');
  });

  it('Should reset setTimeout if mouse enter before timeout is over', () => {
    wrapper.simulate('mousemove');
    wrapper.simulate('mouseleave');
    clock.tick(500);
    wrapper.simulate('mousemove');
    clock.tick(1000);
    expect(wrapper.find('.tooltip')).to.have.className('shownTooltip');
  });
});
