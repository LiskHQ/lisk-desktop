import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { PrimaryButton, TertiaryButton } from 'src/theme/buttons';
import { mountWithContext } from '@tests/unit-test-utils/mountHelpers';
import ErrorBoundary from './errorBoundary';

describe('ErrorBoundary:', () => {
  const NonProblematicChild = () => <div className="child-no-error"></div>; // eslint-disable-line
  const ProblematicChild = () => {
    throw new Error('Error thrown from problem child');
    return <div>Error</div>; // eslint-disable-line
  };

  describe('when rendering childs', () => {
    let wrapper;
    const props = {
      errorMessage: 'Should show this message on error',
    };

    it('should show error message when error occured in child', () => {
      wrapper = mountWithContext(
        <MemoryRouter>
          <ErrorBoundary {...props}>
            <ProblematicChild />
          </ErrorBoundary>
        </MemoryRouter>,
        { storeState: {} }
      );

      expect(wrapper.find('.error-boundary-container').exists()).toBeTruthy();
      expect(wrapper.find('h2')).toHaveText('An error occurred.');
      expect(wrapper.find(PrimaryButton)).toHaveText('Reload the page');
      expect(wrapper.find(TertiaryButton)).toHaveText('Report the error via email');
      expect(wrapper.find('a').at(0).props().href).toEqual(
        'mailto:desktopdev@lisk.com?&subject=User Reported Error - Lisk - &body=Error: Error thrown from problem child found on route "/":%0A%0A in ProblematicChild%0A in ErrorBoundary%0A in Unknown (created by Context.Consumer)%0A in withRouter()%0A in Router (created by MemoryRouter)%0A in MemoryRouter (created by WrapperComponent)%0A in WrapperComponent'
      );
    });

    it('should render childs when no errors', () => {
      wrapper = mountWithContext(
        <MemoryRouter>
          <ErrorBoundary {...props}>
            <NonProblematicChild />
          </ErrorBoundary>
        </MemoryRouter>,
        { storeState: {} }
      );

      expect(wrapper.find('.error-boundary-container').exists()).toBeFalsy();
    });
  });
});
