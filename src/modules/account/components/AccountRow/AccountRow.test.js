import React from 'react';
import { render } from '@testing-library/react';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { truncateAddress } from '@wallet/utils/account';
import AccountRow from './AccountRow';

jest.mock('react-i18next');

const props = {
  account: mockSavedAccounts[0],
  onRemove: jest.fn(),
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
    expect(container.getByText(truncateAddress(mockSavedAccounts[0].metadata.address))).toBeTruthy();
  });

  it('Should show delete button', async () => {
    const container = render(<AccountRow {...props} />);
    container.rerender(<AccountRow {...props} onRemove={jest.fn()} />);
    expect(container.queryByTestId(`${mockSavedAccounts[0].metadata.address}-delete`)).toBeTruthy();
  });
});
