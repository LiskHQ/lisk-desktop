import React from 'react';
import { fireEvent, waitFor } from '@testing-library/dom';
import { renderWithRouterAndQueryClient } from 'src/utils/testHelpers';
import mockSavedAccounts from '@tests/fixtures/accounts';
import accounts from '@tests/constants/wallets';
import { useApplicationManagement } from '@blockchainApplication/manage/hooks';
import mockManagedApplications from '@tests/fixtures/blockchainApplicationsManage';
import Request from './request';

const mockCurrentAccount = mockSavedAccounts[0];
const mockSetApplication = jest.fn();
jest.mock(
  'src/modules/common/components/converter',
  () =>
    function ConverterMock() {
      return <span className="converted-price" />;
    }
);
jest.mock('@account/hooks/useCurrentAccount.js', () => ({
  useCurrentAccount: jest.fn(() => [mockCurrentAccount]),
}));
jest.mock('@blockchainApplication/manage/hooks/useApplicationManagement');

describe('Request', () => {
  let wrapper;

  const props = {
    address: accounts.genesis.summary.address,
    t: (v) => v,
  };

  useApplicationManagement.mockReturnValue({
    setApplication: mockSetApplication,
    applications: mockManagedApplications.map((app, index) =>
      index === 0 ? { ...app, chainID: '00010000' } : app
    ),
  });

  it('should render modal properly', async () => {
    wrapper = renderWithRouterAndQueryClient(Request, props);

    expect(
      wrapper.getByText(
        'Simply scan the QR code using the Lisk Mobile app or any other QR code reader.'
      )
    ).toBeTruthy();
    expect(
      wrapper.getByText(
        'Use the sharing link to easily request any amount of tokens from Lisk Desktop or Lisk Mobile users.'
      )
    ).toBeTruthy();
    expect(wrapper.getByText('Account')).toBeTruthy();
    expect(wrapper.getByText('Recipient application')).toBeTruthy();
    expect(wrapper.getByText('Account')).toBeTruthy();
    expect(wrapper.getByText('Token')).toBeTruthy();
    expect(wrapper.getByText('Add message (Optional)')).toBeTruthy();
    expect(wrapper.getByText('Copy link')).toBeTruthy();
    expect(wrapper.getByText('Request tokens')).toBeTruthy();
    expect(
      wrapper.getByTestId(`wallet-visual-${mockSavedAccounts[0].metadata.address}`)
    ).toBeTruthy();
    expect(wrapper.getByText(mockSavedAccounts[0].metadata.address)).toBeTruthy();
    expect(wrapper.getByText(mockSavedAccounts[0].metadata.name)).toBeTruthy();

    fireEvent.click(wrapper.getByText('Add message (Optional)'));

    await waitFor(() => {
      expect(wrapper.queryByText('Add message (Optional)')).toBeFalsy();
      expect(wrapper.getByText('Message (Optional)')).toBeTruthy();
      expect(wrapper.getByText('Remove')).toBeTruthy();
      expect(wrapper.getByAltText('removeBlueIcon')).toBeTruthy();
    });
  });
});
