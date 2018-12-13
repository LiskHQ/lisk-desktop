import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import AccountVisual from './index';
import accounts from '../../../test/constants/accounts';
import breakpoints from '../../constants/breakpoints';

describe('AccountVisual', () => {
  it('should create account visual of an address', () => {
    const wrapper = mount(<AccountVisual address={accounts.genesis.address} />);

    // should render an svg element
    expect(wrapper).to.have.exactly(1).descendants('svg');
    expect(wrapper.find('svg')).to.have.attr('height', '200');
    expect(wrapper.find('svg')).to.have.attr('width', '200');

    // with 3 circles and 1 polygon
    expect(wrapper).to.have.exactly(3).descendants('circle');
    expect(wrapper).to.have.exactly(1).descendants('polygon');

    // and a circle of full width and height of the svg
    expect(wrapper.find('circle').at(0)).to.have.attr('cx', '100');
    expect(wrapper.find('circle').at(0)).to.have.attr('cy', '100');
    expect(wrapper.find('circle').at(0)).to.have.attr('r', '100');
    expect(wrapper.find('circle').at(0)).to.have.attr('fill').match(/url\(#marshmallow-FG-\d{13}-\w{5}\)/);

    // and another big circle on a side
    expect(wrapper.find('circle').at(1)).to.have.attr('cx', '230');
    expect(wrapper.find('circle').at(1)).to.have.attr('cy', '235');
    expect(wrapper.find('circle').at(1)).to.have.attr('r', '180');
    expect(wrapper.find('circle').at(1)).to.have.attr('fill').match(/url\(#marshmallow-BG-\d{13}-\w{5}\)/);

    // and another small circle somewhere in the middle
    expect(wrapper.find('circle').at(2)).to.have.attr('cx', '80.6');
    expect(wrapper.find('circle').at(2)).to.have.attr('cy', '95.6');
    expect(wrapper.find('circle').at(2)).to.have.attr('r', '30.599999999999998');
    expect(wrapper.find('circle').at(2)).to.have.attr('fill').match(/url\(#marshmallow-2-\d{13}-\w{5}\)/);

    // and a polygon element with points of a triangle
    expect(wrapper.find('polygon')).to.have.attr('points', '45,25 137,48 68,117');
    expect(wrapper.find('polygon')).to.have.attr('fill').match(/url\(#marshmallow-3-\d{13}-\w{5}\)/);
  });

  it('should be able to create account visual that contains a rectangle', () => {
    const wrapper = mount(<AccountVisual address={accounts.delegate.address} />);
    expect(wrapper.find('rect')).to.have.attr('x', '55');
    expect(wrapper.find('rect')).to.have.attr('y', '45');
    expect(wrapper.find('rect')).to.have.attr('height', '82.8');
    expect(wrapper.find('rect')).to.have.attr('width', '82.8');
    expect(wrapper.find('rect')).to.have.attr('fill').match(/url\(#loriot-3-\d{13}-\w{5}\)/);
  });

  it('should have given default size and change to sizeS size if resized to S breakpoint', () => {
    const props = {
      address: accounts.genesis.address,
      size: 100,
      sizeS: 60,
    };

    const wrapper = mount(<AccountVisual {...props} />);

    expect(wrapper).to.have.exactly(1).descendants('svg');
    expect(wrapper.find('svg')).to.have.attr('height', `${props.size}`);
    expect(wrapper.find('svg')).to.have.attr('width', `${props.size}`);

    // manipulate breakpoints to simulate s breakpoint
    const sBreakpointBackup = breakpoints.s;
    breakpoints.s = window.innerWidth + 1;
    window.dispatchEvent(new Event('resize'));

    expect(wrapper).to.have.exactly(1).descendants('svg');
    expect(wrapper.find('svg')).to.have.attr('height', `${props.sizeS}`);
    expect(wrapper.find('svg')).to.have.attr('width', `${props.sizeS}`);

    breakpoints.s = sBreakpointBackup;
  });

  it('should removeEventListener on unmount', () => {
    sinon.spy(window, 'removeEventListener');
    const wrapper = shallow(<AccountVisual address='sadasdasfsg43r43wt35t' />);
    expect(window.removeEventListener).to.not.have.been.calledWith();
    wrapper.unmount();
    expect(window.removeEventListener).to.have.been.calledWith('resize');

    window.removeEventListener.restore();
  });
});
