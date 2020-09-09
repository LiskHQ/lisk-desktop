import React from 'react';
import { mount } from 'enzyme';
import AccountVisual from './index';
import accounts from '../../../../test/constants/accounts';

describe('AccountVisual', () => {
  it('should create account visual of an address', () => {
    const wrapper = mount(<AccountVisual address="16313739661670634666L" />);

    // should render an svg element
    expect(wrapper.find('svg')).toHaveLength(1);
    expect(wrapper.find('svg').getDOMNode().getAttribute('height')).toEqual('40');
    expect(wrapper.find('svg').getDOMNode().getAttribute('width')).toEqual('40');

    // with 3 circles and 1 polygon
    expect(wrapper.find('circle')).toHaveLength(3);
    expect(wrapper.find('polygon')).toHaveLength(1);

    // and a circle of full width and height of the svg
    expect(wrapper.find('circle').at(0).getDOMNode().getAttribute('cx')).toEqual('20');
    expect(wrapper.find('circle').at(0).getDOMNode().getAttribute('cy')).toEqual('20');
    expect(wrapper.find('circle').at(0).getDOMNode().getAttribute('r')).toEqual('20');
    expect(/url\(#marshmallow-FG-\d{13}-\w{5}\)/
      .test(wrapper.find('circle').at(0).getDOMNode().getAttribute('fill'))).toEqual(true);

    // and another big circle on a side
    expect(wrapper.find('circle').at(1).getDOMNode().getAttribute('cx')).toEqual('46');
    expect(wrapper.find('circle').at(1).getDOMNode().getAttribute('cy')).toEqual('47');
    expect(wrapper.find('circle').at(1).getDOMNode().getAttribute('r')).toEqual('36');
    expect(/url\(#marshmallow-BG-\d{13}-\w{5}\)/
      .test(wrapper.find('circle').at(1).getDOMNode().getAttribute('fill'))).toEqual(true);

    // and another small circle somewhere in the middle
    expect(wrapper.find('circle').at(2).getDOMNode().getAttribute('cx')).toEqual('16.12');
    expect(wrapper.find('circle').at(2).getDOMNode().getAttribute('cy')).toEqual('19.12');
    expect(wrapper.find('circle').at(2).getDOMNode().getAttribute('r')).toEqual('6.12');
    expect(/url\(#marshmallow-2-\d{13}-\w{5}\)/
      .test(wrapper.find('circle').at(2).getDOMNode().getAttribute('fill'))).toEqual(true);

    // and a polygon element with points of a triangle
    expect(wrapper.find('polygon').getDOMNode().getAttribute('points')).toEqual('9,5 27.4,9.6 13.6,23.4');
    expect(/url\(#marshmallow-3-\d{13}-\w{5}\)/
      .test(wrapper.find('polygon').getDOMNode().getAttribute('fill'))).toEqual(true);
  });

  it('should be able to create account visual that contains a rectangle', () => {
    const wrapper = mount(<AccountVisual address={accounts.delegate.address} />);
    expect(wrapper.find('rect').getDOMNode().getAttribute('x')).toEqual('11');
    expect(wrapper.find('rect').getDOMNode().getAttribute('y')).toEqual('9');
    expect(wrapper.find('rect').getDOMNode().getAttribute('height')).toEqual('16.56');
    expect(wrapper.find('rect').getDOMNode().getAttribute('width')).toEqual('16.56');
    expect(/url\(#loriot-3-\d{13}-\w{5}\)/
      .test(wrapper.find('rect').getDOMNode().getAttribute('fill'))).toEqual(true);
  });
});
