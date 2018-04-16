import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import AccountVisual from './index';

describe('AccountVisual', () => {
  it('should call resizeWindow once', () => {
    sinon.spy(AccountVisual.prototype, 'componentDidMount');
    sinon.spy(AccountVisual.prototype, 'resizeWindow');
    const wrapper = shallow(<AccountVisual address='sadasdasfsg43r43wt35t' />); // eslint-disable-line
    const resizeEvent = new Event('resize');
    window.dispatchEvent(resizeEvent);
    expect(AccountVisual.prototype.componentDidMount.calledOnce).to.equal(true);
    expect(AccountVisual.prototype.resizeWindow.calledOnce).to.equal(true);
  });
});
