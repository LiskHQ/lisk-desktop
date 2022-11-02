import React from 'react';
import { render } from '@testing-library/react';
import mockSavedAccounts from '@tests/fixtures/accounts';
import AccountRow from './AccountRow';

jest.mock('react-i18next');

const props = {
  account: mockSavedAccounts[0],
  showRemove: true,
};

describe('Select Account Row', () => {
  it('Should render account list', async () => {
    const container = render(<AccountRow {...props} />);
    expect(container.getByText(mockSavedAccounts[0].metadata.address)).toBeTruthy();
    expect(container.getByText(mockSavedAccounts[0].metadata.name)).toBeTruthy();
  });

  it('Should truncated addresses in the list', async () => {
    const truncationProps = {
      ...props,
      truncate: true,
    };
    const container = render(<AccountRow {...truncationProps} />);
    expect(container.getByText('lsk74a...4oj6e')).toBeTruthy();
  });

  it('Should  list', async () => {
    const container = render(<AccountRow {...props} />);
    container.rerender(<AccountRow {...props} showRemove />);
    expect(container.queryByTestId(`${mockSavedAccounts[0].metadata.address}-delete`)).toBeTruthy();
  });
});
