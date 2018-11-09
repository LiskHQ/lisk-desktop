import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import Toaster from './toaster';
import actionTypes from '../../constants/actions';
import { mapStateToProps, mapDispatchToProps } from './index';

describe('Toaster', () => {
  const toasts = [{
    label: 'test',
    type: 'success',
    index: 0,
  }];
  const toasterProps = {
    toasts,
    hideToast: () => {},
  };

  const hideToastSpy = sinon.spy(toasterProps, 'hideToast');

  it('renders <Snackbar /> component from react-toolbox', () => {
    const wrapper = mount(<Toaster {...toasterProps} />);
    expect(wrapper.find('Snackbar')).to.have.length(1);
  });

  it('hides the toast and after the animation ends calls this.props.hideToast()', () => {
    document.body.prepend(document.createElement('div'));
    const clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
    });
    mount(<Toaster {...toasterProps} />, { attachTo: document.body.firstChild });
    let toastElement = document.getElementsByClassName('toast');

    // check if the toast is activated
    expect(toastElement.length > 0 && toastElement[0].className.indexOf('success') > 0).to.equal(true);

    clock.tick(4510);

    // check if the toast is deactivated
    toastElement = document.getElementsByClassName('toast');

    // check if hideToast is called
    expect(hideToastSpy).to.have.been.calledWith(toasts[0]);

    hideToastSpy.restore();

    clock.restore();
  });

  it('hideToast dispatches toastHidden action', () => {
    const dispatchSpy = sinon.spy();
    const { hideToast } = mapDispatchToProps(dispatchSpy);
    const payload = [{ toast1: {} }];
    hideToast(payload);
    const dispatchSpyCallArgs = dispatchSpy.args[0][0];
    expect(dispatchSpyCallArgs.type).to.be.eql(actionTypes.toastHidden);
    expect(dispatchSpyCallArgs.data).to.be.eql(payload);
  });

  it('inits with empty toasts when empty state', () => {
    const initialState = {};
    const toastsState = mapStateToProps(initialState);
    expect(toastsState.toasts.length).to.be.equal(0);
  });
});
