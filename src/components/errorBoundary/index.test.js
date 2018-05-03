import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { mountWithContext } from './../../../test/utils/mountHelpers';
import ErrorBoundary from './index';

describe('ErrorBoundary:', () => {
  const NonProblematicChild = () =>
    <div className='child-no-error'></div>; // eslint-disable-line

  /* eslint-disable no-console */
  const pauseErrorLogging = (codeToRun) => {
    const logger = console.error;
    console.error = () => {};
    codeToRun();
    console.error = logger;
  };
  /* eslint-enable no-console */

  describe('when rendering childs', () => {
    let wrapper;
    const props = {
      errorMessage: 'Should show this message on error',
    };
    const ProblematicChild = () => {
      throw new Error('Error thrown from problem child');
      return <div>Error</div>; // eslint-disable-line
    };

    // TODO: reenable once enzyme gives support to react 16
    // github.com/airbnb/enzyme/issues/1255
    it.skip('should show error message when error occured in child', (done) => {
      const componentDidCatchSpy = spy(ErrorBoundary.prototype, 'componentDidCatch');
      try {
        pauseErrorLogging(() => {
          wrapper = mountWithContext(<ErrorBoundary {...props}>
            <ProblematicChild />
          </ErrorBoundary>, { storeState: {} });
        });
      } catch (err) {
        expect(componentDidCatchSpy).to.have.been.called();
        expect(wrapper.find('.error-header')).to.have.text(props.errorMessage);
        componentDidCatchSpy.restore();
        done();
      } // eslint-disable-line 
    });

    it('should render childs when no errors', () => {
      wrapper = mountWithContext(<ErrorBoundary {...props}>
        <NonProblematicChild />
      </ErrorBoundary>, { storeState: {} });

      wrapper.update();
      expect(wrapper.find('.error-header')).not.to.be.present();
    });
  });
});
