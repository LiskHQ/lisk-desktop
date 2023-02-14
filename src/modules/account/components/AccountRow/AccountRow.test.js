import React from 'react';
import { render } from '@testing-library/react';
import mockSavedAccounts from '@tests/fixtures/accounts';
import mockSavedHwAccounts from '@tests/fixtures/hwAccounts';
import { truncateAddress } from '@wallet/utils/account';
import AccountRow from './AccountRow';

jest.mock('react-i18next');

const mockOnRemove = jest.fn();

const props = {
  account: mockSavedAccounts[0],
  onRemove: mockOnRemove,
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
    expect(
      container.getByText(truncateAddress(mockSavedAccounts[0].metadata.address))
    ).toBeTruthy();
  });

  it('Should show delete button', async () => {
    const container = render(<AccountRow {...props} />);
    container.rerender(<AccountRow {...props} onRemove={mockOnRemove} />);
    expect(container.queryByTestId(`${mockSavedAccounts[0].metadata.address}-delete`)).toBeTruthy();
  });

  it('Should show hw icon', async () => {
    const newProps = { ...props, account: mockSavedHwAccounts[0] };
    const { getByAltText } = render(<AccountRow {...newProps} />);
    expect(getByAltText('hardwareWalletIcon')).toBeTruthy();
  });
});
