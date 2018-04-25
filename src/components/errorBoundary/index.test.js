import React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import { mount } from 'enzyme';
import ErrorBoundary from './index';


const ProblemChild = () => {
  throw new Error('Error thrown from problem child');
  return <div>Error</div>; // eslint-disable-line
};

/* eslint-disable mocha/no-exclusive-tests */
const props = {
  errorMessage: 'Should show this message on error',
};

describe('ErrorBoundary:', () => {
  describe('on development environment', () => {
    const envDevelopmentProps = {
      ...props,
      isDevelopment: true,
    };
    let componentDidCatchSpy;
    let wrapper;

    beforeEach(() => {
      componentDidCatchSpy = spy(ErrorBoundary.prototype, 'componentDidCatch');
      try {
        wrapper = mount(<ErrorBoundary {...envDevelopmentProps}>
          <ProblemChild />
        </ErrorBoundary>);
      } catch (err) {} // eslint-disable-line
    });

    it('handles error and shows message on child error with stacktrace', () => {
      expect(componentDidCatchSpy).to.have.been.calledWith();
      expect(wrapper.find('.error-header')).to.have.text(props.errorMessage);
      expect(wrapper.find('.error-body').text().indexOf('in ProblemChild')).to.be.greaterThan(-1);
    });
  });

  describe('on production environment', () => {
    const notEnvDevelopmentProps = {
      ...props,
      isDevelopment: false,
    };
    let componentDidCatchSpy;
    let wrapper;

    beforeEach(() => {
      componentDidCatchSpy = spy(ErrorBoundary.prototype, 'componentDidCatch');
      try {
        wrapper = mount(<ErrorBoundary {...notEnvDevelopmentProps}>
          <ProblemChild />
        </ErrorBoundary>);
      } catch (err) {} // eslint-disable-line
    });

    it('handles error and shows message on child error without stacktrace', () => {
      expect(componentDidCatchSpy).to.have.been.calledWith();
      expect(wrapper.find('.error-header')).to.have.text(props.errorMessage);
      expect(wrapper.find('.error-body')).not.to.be.present();
    });
  });
});
/* eslint-enable mocha/no-exclusive-tests */
