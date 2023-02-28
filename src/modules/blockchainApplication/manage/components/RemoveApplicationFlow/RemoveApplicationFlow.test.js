import moment from 'moment';
import { act } from 'react-dom/test-utils';
import { fireEvent, screen } from '@testing-library/react';
import mockManagedApplications from '@tests/fixtures/blockchainApplicationsManage';
import { renderWithRouter } from 'src/utils/testHelpers';
import {
  usePinBlockchainApplication,
  useApplicationManagement,
} from '@blockchainApplication/manage/hooks';
import { removeSearchParamsFromUrl, parseSearchParams } from 'src/utils/searchParams';
import RemoveApplicationFlow from '.';

const mockedPins = ['1111'];
const mockTogglePin = jest.fn();
const mockDeleteApplicationByChainId = jest.fn();

jest.mock('@blockchainApplication/manage/hooks/usePinBlockchainApplication');
jest.mock('@blockchainApplication/manage/hooks/useApplicationManagement');
jest.mock('src/utils/searchParams');

usePinBlockchainApplication.mockReturnValue({
  togglePin: mockTogglePin,
  pins: mockedPins,
  checkPinByChainId: jest.fn().mockReturnValue(true),
});

useApplicationManagement.mockReturnValue({
  deleteApplicationByChainId: mockDeleteApplicationByChainId,
});
parseSearchParams.mockImplementation(() => ({ chainId: mockManagedApplications[0].chainID }));

describe('BlockchainApplicationFlow', () => {
  const props = {
    testHistory: {
      push: jest.fn(),
    },
    testLocation: { search: `chainId=${mockManagedApplications[0].chainID}` },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    renderWithRouter(RemoveApplicationFlow, props);
  });

  it('should display properly', () => {
    const { chainName, address, state, lastCertificateHeight, lastUpdated } =
      mockManagedApplications[0];

    expect(screen.getByText(chainName)).toBeTruthy();
    expect(screen.getByText(address)).toBeTruthy();
    expect(screen.getByText(state)).toBeTruthy();
    expect(screen.getByText(lastCertificateHeight)).toBeTruthy();
    expect(screen.getByText(moment(lastUpdated).format('DD MMM YYYY'))).toBeTruthy();

    expect(screen.getByText('Chain ID')).toBeTruthy();
    expect(screen.getByText('Remove application')).toBeTruthy();
    expect(screen.getByText('Status')).toBeTruthy();
    expect(screen.getByText('Last Update')).toBeTruthy();
    expect(screen.getByText('Last Certificate Height')).toBeTruthy();
    expect(screen.getByText('Deposited:')).toBeTruthy();
  });

  it('should dismiss remove flow', () => {
    act(() => {
      fireEvent.click(screen.getByText('Cancel'));
    });

    expect(removeSearchParamsFromUrl).toHaveBeenCalled();
  });

  it('should move the the success page when application is deleted', () => {
    const { chainName } = mockManagedApplications[0];

    act(() => {
      fireEvent.click(screen.getByText('Remove application now'));
    });
    expect(screen.getByText('Application has now been removed')).toBeTruthy();
    expect(screen.getByText(chainName)).toBeTruthy();
  });
});
