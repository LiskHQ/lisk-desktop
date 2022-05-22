import React from 'react';
import { render, screen } from '@testing-library/react';
import mockSavedAccounts from '@tests/fixtures/accounts';
import AccountRow from './AccountRow';

jest.mock('react-i18next');

const props = {
  account: mockSavedAccounts[0],
};

beforeEach(() => {
  render(<AccountRow {...props} />);
});

describe('Select Account Form', () => {
  it('Should render account list', async () => {
    expect(screen.getByText(mockSavedAccounts[0].metadata.address)).toBeTruthy();
    expect(screen.getByText(mockSavedAccounts[0].metadata.name)).toBeTruthy();
  });
});
