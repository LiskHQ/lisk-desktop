import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import Toaster from './toaster';

describe('Toaster', () => {
  let wrapper;
  const toasts = [{
    label: 'test',
    type: 'success',
    index: 0,
  }];
  const toasterProps = {
    toasts,
    hideToast: sinon.spy(),
  };

  beforeEach(() => {
    wrapper = mount(<Toaster {...toasterProps} />);
  });

  it('renders <Snackbar /> component from react-toolbox', () => {
    expect(wrapper.find('Snackbar')).to.have.length(1);
  });

  describe('hideToast', () => {
    it('hides the toast and after the animation ends calls this.props.hideToast()', () => {
      const clock = sinon.useFakeTimers();
      wrapper.instance().hideToast(toasts[0]);
      expect(wrapper.state('hidden')).to.deep.equal({ [toasts[0].index]: true });
      clock.tick(510);
      expect(wrapper.state('hidden')).to.deep.equal({ [toasts[0].index]: false });
      clock.restore();
      expect(toasterProps.hideToast).to.have.been.calledWith(toasts[0]);
    });
  });
});
