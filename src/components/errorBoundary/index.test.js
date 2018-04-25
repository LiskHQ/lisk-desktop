import React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import { mount } from 'enzyme';
import ErrorBoundary from './index';

/* eslint-disable mocha/no-exclusive-tests */
describe.only('ErrorBoundary:', () => {
  const props = {
    errorMessage: 'Should show this message on error',
  };
  let wrapper;

  /* eslint-disable no-console */
  const pauseErrorLogging = (codeToRun) => {
    const logger = console.error;
    console.error = () => {};
    codeToRun();
    console.error = logger;
  };
  /* eslint-enable no-console */

  it('should show message on child error with stacktrace', () => {
    const ProblemChild = () => {
      throw new Error('Error thrown from problem child');
      return <div>Error</div>; // eslint-disable-line
    };
    try {
      pauseErrorLogging(() => {
        wrapper = mount(<ErrorBoundary {...props}>
          <ProblemChild />
        </ErrorBoundary>);
      });
    } catch (err) {} // eslint-disable-line
    expect(wrapper.find('.error-header')).to.have.text(props.errorMessage);
    expect(wrapper.find('.error-body').text().indexOf('inProblemChild')).to.be.greaterThan(-1);
  });

  it('should show message on child error without stacktrace ', () => {
    const ProblemChild = () => {
      throw new Error('Error thrown from problem child');
      return <div>Error</div>; // eslint-disable-line
    };
    try {
      wrapper = mount(<ErrorBoundary {...props}>
        <ProblemChild />
      </ErrorBoundary>);
    } catch (err) {
      wrapper.setProps({ isDevelopment: false });
      wrapper.update();
      expect(wrapper.find('.error-header')).to.have.text(props.errorMessage);
      expect(wrapper.find('.error-body')).not.to.be.present();
    }
  });
});

/* eslint-enable mocha/no-exclusive-tests */
