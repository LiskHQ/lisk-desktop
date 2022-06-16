import React from 'react';
import { mountWithRouter } from 'src/utils/testHelpers';
import mockSavedAccounts from '@tests/fixtures/accounts';
import RemoveAccount from './RemoveAccount';

jest.mock('@account/hooks/useAccounts', () => ({
  useAccounts: jest.fn().mockReturnValue([mockSavedAccounts]),
}));

describe('Remove account', () => {
  const props = {
    address: '',
    history: {
      location: {
        path: '/account/remove-account/',
        search: '?address=',
      },
      push: jest.fn(),
    },
  };

  it('should render properly', () => {
    const wrapper = mountWithRouter(
      RemoveAccount,
      props,
    );
    expect(wrapper).toContainMatchingElement('Box');
    expect(wrapper).toContainMatchingElement('BoxContent');
    expect(wrapper).toContainMatchingElement('MultiStep');
    expect(wrapper).toContainMatchingElement('RemoveConfirmation');
    expect(wrapper).toContainMatchingElement('RemoveSuccess');
  });
});
