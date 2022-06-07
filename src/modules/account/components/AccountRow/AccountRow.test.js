import React from 'react';
import { render } from '@testing-library/react';
import mockSavedAccounts from '@tests/fixtures/accounts';
import AccountRow from './AccountRow';

jest.mock('react-i18next');

let container = null;
const props = {
  account: mockSavedAccounts[0],
  showRemove: true,
};

beforeEach(() => {
  container = render(<AccountRow {...props} />);
});

describe('Select Account Row', () => {
  it('Should render account list', async () => {
    expect(container.getByText(mockSavedAccounts[0].metadata.address)).toBeTruthy();
    expect(container.getByText(mockSavedAccounts[0].metadata.name)).toBeTruthy();
  });

  it('Should  list', async () => {
    container.rerender(<AccountRow {...props} showRemove />);
    expect(container.queryByTestId('delete-icon')).toBeTruthy();
  });
});
