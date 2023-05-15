import moment from 'moment';
import { act } from 'react-dom/test-utils';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithRouterAndQueryClient } from 'src/utils/testHelpers';
import {
  usePinBlockchainApplication,
  useApplicationManagement,
} from '@blockchainApplication/manage/hooks';
import { removeSearchParamsFromUrl, parseSearchParams } from 'src/utils/searchParams';
import { useBlockchainApplicationExplore } from '../../../explore/hooks/queries/useBlockchainApplicationExplore';
import { useBlockchainApplicationMeta } from '../../hooks/queries/useBlockchainApplicationMeta';
import { mockBlockchainApp } from '../../../explore/__fixtures__';
import { mockBlockchainAppMeta } from '../../__fixtures__';
import RemoveApplicationFlow from '.';

const mockedPins = ['1111'];
const mockTogglePin = jest.fn();
const mockDeleteApplicationByChainId = jest.fn();

jest.mock('@blockchainApplication/manage/hooks/usePinBlockchainApplication');
jest.mock('@blockchainApplication/manage/hooks/useApplicationManagement');
jest.mock('src/utils/searchParams');
jest.mock('../../../explore/hooks/queries/useBlockchainApplicationExplore');
useBlockchainApplicationExplore.mockReturnValue({
  data: { data: mockBlockchainApp.data },
  isLoading: false,
  isError: undefined,
});
jest.mock('../../../manage/hooks/queries/useBlockchainApplicationMeta');
useBlockchainApplicationMeta.mockReturnValue({
  data: { data: mockBlockchainAppMeta.data },
  isLoading: false,
  isError: undefined,
});

usePinBlockchainApplication.mockReturnValue({
  togglePin: mockTogglePin,
  pins: mockedPins,
  checkPinByChainId: jest.fn().mockReturnValue(true),
});

useApplicationManagement.mockReturnValue({
  deleteApplicationByChainId: mockDeleteApplicationByChainId,
});
parseSearchParams.mockImplementation(() => ({ chainId: mockBlockchainApp.data[0].chainID }));

describe('BlockchainApplicationFlow', () => {
  const props = {
    testHistory: {
      push: jest.fn(),
    },
    testLocation: { search: `chainId=${mockBlockchainApp.data[0].chainID}` },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    renderWithRouterAndQueryClient(RemoveApplicationFlow, props);
  });

  it('should display properly', () => {
    const { name, address, status, lastCertificateHeight, lastUpdated } = mockBlockchainApp.data[0];

    expect(screen.getByText(name)).toBeTruthy();
    expect(screen.getByText(address)).toBeTruthy();
    expect(screen.getByText(status)).toBeTruthy();
    expect(screen.getByText(lastCertificateHeight)).toBeTruthy();
    expect(screen.getByText(moment(lastUpdated * 1000).format('DD MMM YYYY'))).toBeTruthy();

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
    const { name } = mockBlockchainApp.data[0];

    act(() => {
      fireEvent.click(screen.getByText('Remove application now'));
    });
    expect(screen.getByText('Application has now been removed')).toBeTruthy();
    expect(screen.getByText(name)).toBeTruthy();
  });
});
