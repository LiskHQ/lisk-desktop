import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import Toaster from './toaster';

describe('Toaster', () => {
  const toasts = [{
    label: 'test',
    type: 'success',
    index: 0,
  }];
  const toasterProps = {
    toasts,
    hideToast: sinon.spy(),
  };

  it('renders <Snackbar /> component from react-toolbox', () => {
    const wrapper = mount(<Toaster {...toasterProps} />);
    expect(wrapper.find('Snackbar')).to.have.length(1);
  });

  describe('hideToast', () => {
    it('hides the toast and after the animation ends calls this.props.hideToast()', () => {
      document.body.prepend(document.createElement('div'));
      const clock = sinon.useFakeTimers({
        toFake: ['setTimeout', 'clearTimeout', 'Date'],
      });
      mount(<Toaster {...toasterProps} />, { attachTo: document.body.firstChild });
      let toastElement = document.getElementsByClassName('toast');

      // check if the toast is activated
      expect(toastElement.length > 0 &&
        toastElement[0].className.indexOf('active') > 0)
        .to.equal(true);

      clock.tick(4510);

      // check if the toast is deactivated
      toastElement = document.getElementsByClassName('toast');

      // check if hideToast is called
      expect(toasterProps.hideToast).to.have.been.calledWith(toasts[0]);
      clock.restore();
    });
  });
});
