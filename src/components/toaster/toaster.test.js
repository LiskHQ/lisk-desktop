import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';
import Toaster from './toaster';
import store from '../../store';
import history from '../../history';
import i18n from '../../i18n';

import { mountWithContext } from './../../../test/utils/mountHelpers';

/* eslint-disable mocha/no-exclusive-tests */
describe.only('Toaster', () => {
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
    expect(toastElement.length > 0 &&
      toastElement[0].className.indexOf('active') > 0)
      .to.equal(true);

    clock.tick(4510);

    // check if the toast is deactivated
    toastElement = document.getElementsByClassName('toast');

    // check if hideToast is called
    expect(hideToastSpy).to.have.been.calledWith(toasts[0]);

    hideToastSpy.restore();

    clock.restore();
  });

  it('dispatches toastHidden action when calling hideToast', () => {
    const clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
    });
    const propsWithToasts = {
      toasts: [...toasts],
    };
    const wrapper = mount(<Router><Toaster {...propsWithToasts}></Toaster></Router>,
      {
        context: { store, history, i18n },
        childContextTypes: {
          store: PropTypes.object.isRequired,
          history: PropTypes.object.isRequired,
          i18n: PropTypes.object.isRequired,
        },
      },
    );
    const snackBar = wrapper.find('Snackbar').first();
    snackBar.props().onTimeout();
    clock.tick(1000);
  });
});
/* eslint-enable mocha/no-exclusive-tests */
