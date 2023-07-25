import React from 'react';
import { mount } from 'enzyme';
import accounts from '@tests/constants/wallets';
import WalletVisual from './index';

describe('WalletVisual', () => {
  it.skip('should create account visual of an address', () => {
    const wrapper = mount(<WalletVisual address="lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6" />);

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
    expect(
      /url\(#marshmallow-FG-\d{13}-\w{5}\)/.test(
        wrapper.find('circle').at(0).getDOMNode().getAttribute('fill')
      )
    ).toEqual(true);

    // and another big circle on a side
    expect(wrapper.find('circle').at(1).getDOMNode().getAttribute('cx')).toEqual('46');
    expect(wrapper.find('circle').at(1).getDOMNode().getAttribute('cy')).toEqual('47');
    expect(wrapper.find('circle').at(1).getDOMNode().getAttribute('r')).toEqual('36');
    expect(
      /url\(#marshmallow-BG-\d{13}-\w{5}\)/.test(
        wrapper.find('circle').at(1).getDOMNode().getAttribute('fill')
      )
    ).toEqual(true);

    // and another small circle somewhere in the middle
    expect(wrapper.find('circle').at(2).getDOMNode().getAttribute('cx')).toEqual('16.12');
    expect(wrapper.find('circle').at(2).getDOMNode().getAttribute('cy')).toEqual('19.12');
    expect(wrapper.find('circle').at(2).getDOMNode().getAttribute('r')).toEqual('6.12');
    expect(
      /url\(#marshmallow-2-\d{13}-\w{5}\)/.test(
        wrapper.find('circle').at(2).getDOMNode().getAttribute('fill')
      )
    ).toEqual(true);

    // and a polygon element with points of a triangle
    expect(wrapper.find('polygon').getDOMNode().getAttribute('points')).toEqual(
      '9,5 27.4,9.6 13.6,23.4'
    );
    expect(
      /url\(#marshmallow-3-\d{13}-\w{5}\)/.test(
        wrapper.find('polygon').getDOMNode().getAttribute('fill')
      )
    ).toEqual(true);
  });

  it('should be able to create account visual that contains a rectangle', () => {
    const wrapper = mount(<WalletVisual address={accounts.genesis.summary.address} />);
    expect(wrapper.find('rect').at(0).getDOMNode().getAttribute('x')).toEqual('11');
    expect(wrapper.find('rect').at(0).getDOMNode().getAttribute('y')).toEqual('12');
    expect(wrapper.find('rect').at(0).getDOMNode().getAttribute('height')).toEqual('48');
    expect(wrapper.find('rect').at(0).getDOMNode().getAttribute('width')).toEqual('48');
    expect(
      /url\(#hub-\w{2}-\d{13}-\w{5}\)/.test(
        wrapper.find('rect').at(0).getDOMNode().getAttribute('fill')
      )
    ).toEqual(true);
  });

  it('should be able to render in disabled mode', () => {
    const wrapper = mount(<WalletVisual address={accounts.genesis.summary.address} disabled />);
    expect(wrapper.find('rect').at(0).getDOMNode().getAttribute('x')).toEqual('11');
    expect(wrapper.find('rect').at(0).getDOMNode().getAttribute('y')).toEqual('12');
    expect(wrapper.find('rect').at(0).getDOMNode().getAttribute('height')).toEqual('48');
    expect(wrapper.find('rect').at(0).getDOMNode().getAttribute('width')).toEqual('48');
    expect(
      /url\(#hub-\w{2}-\d{13}-\w{5}\)/.test(
        wrapper.find('rect').at(0).getDOMNode().getAttribute('fill')
      )
    ).toEqual(true);
  });
});
