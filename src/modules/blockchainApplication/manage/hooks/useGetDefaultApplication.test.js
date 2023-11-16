import { renderHook } from '@testing-library/react-hooks';
import mockApplicationsExplore from '@tests/fixtures/blockchainApplicationsExplore';
import { mockBlockchainAppMeta } from '@blockchainApplication/manage/__fixtures__';
import { useBlockchainApplicationExplore } from '../../explore/hooks/queries/useBlockchainApplicationExplore';
import { useBlockchainApplicationMeta } from './queries/useBlockchainApplicationMeta';
import { useGetDefaultApplication } from './useGetDefaultApplication';

jest.mock('src/utils/api/client');
const mockDispatch = jest.fn();
const mockState = {
  network: {
    name: 'mainnet',
    status: { online: true },
  },
};
const refetchBlockchainApplicationMeta = jest.fn();
const refetchApplicationExplore = jest.fn();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn().mockImplementation((fn) => fn(mockState)),
  useDispatch: () => mockDispatch,
}));

jest.mock('../../explore/hooks/queries/useBlockchainApplicationExplore');
jest.mock('./queries/useBlockchainApplicationMeta');

describe('useCurrentApplication hook', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    jest.clearAllMocks();
  });

  it('should return merged application data', async () => {
    useBlockchainApplicationMeta.mockImplementation(() => ({
      isFetched: true,
      isLoading: false,
      error: null,
      refetch: refetchBlockchainApplicationMeta,
      data: { data: mockBlockchainAppMeta.data },
    }));
    useBlockchainApplicationExplore.mockImplementation(() => ({
      isFetched: true,
      isLoading: false,
      error: null,
      refetch: refetchApplicationExplore,
      data: { data: mockApplicationsExplore },
    }));

    const applications = mockBlockchainAppMeta.data.map(({ chainID, ...restApplication }) => ({
      chainID,
      ...restApplication,
      ...mockApplicationsExplore.find((app) => app.chainID === chainID),
    }));

    const { result } = renderHook(() => useGetDefaultApplication());
    expect(result.current).toEqual(
      expect.objectContaining({
        applications,
        isLoading: false,
        error: null,
        isFetched: true,
      })
    );
  });

  it('should return applications even if exploration data is empty', async () => {
    useBlockchainApplicationMeta.mockImplementation(() => ({
      isFetched: true,
      isLoading: false,
      error: null,
      refetch: refetchBlockchainApplicationMeta,
      data: { data: mockBlockchainAppMeta.data },
    }));
    useBlockchainApplicationExplore.mockImplementation(() => ({
      isFetched: true,
      isLoading: false,
      error: null,
      refetch: refetchApplicationExplore,
      data: { data: [] },
    }));

    const { result } = renderHook(() => useGetDefaultApplication());
    expect(result.current).toEqual(
      expect.objectContaining({
        applications: mockBlockchainAppMeta.data,
        isLoading: false,
        error: null,
        isFetched: true,
      })
    );
  });

  it('should return empty applications list if metadata is not returned', async () => {
    useBlockchainApplicationMeta.mockImplementation(() => ({
      isFetched: false,
      isLoading: false,
      error: 'error',
      refetch: refetchBlockchainApplicationMeta,
      data: { data: undefined },
    }));
    useBlockchainApplicationExplore.mockImplementation(() => ({
      isFetched: true,
      isLoading: false,
      error: null,
      refetch: refetchApplicationExplore,
      data: { data: [] },
    }));

    const { result } = renderHook(() => useGetDefaultApplication());
    expect(result.current).toEqual(
      expect.objectContaining({
        applications: [],
        isLoading: false,
        error: 'error',
        isFetched: false,
      })
    );
  });

  it('should return empty applications list if application explore returns a server error', async () => {
    useBlockchainApplicationMeta.mockImplementation(() => ({
      isFetched: true,
      isLoading: false,
      error: null,
      refetch: refetchBlockchainApplicationMeta,
      data: { data: mockBlockchainAppMeta.data },
    }));
    useBlockchainApplicationExplore.mockImplementation(() => ({
      isFetched: false,
      isLoading: false,
      error: 'error',
      refetch: refetchApplicationExplore,
      data: { data: undefined },
    }));

    const { result } = renderHook(() => useGetDefaultApplication());
    expect(result.current).toEqual(
      expect.objectContaining({
        applications: [],
        isLoading: false,
        error: 'error',
        isFetched: false,
      })
    );
  });

  it('should return empty applications list if application explore returns a server error', async () => {
    useBlockchainApplicationMeta.mockImplementation(() => ({
      isFetched: true,
      isLoading: false,
      error: null,
      refetch: refetchBlockchainApplicationMeta,
      data: { data: mockBlockchainAppMeta.data },
    }));
    useBlockchainApplicationExplore.mockImplementation(() => ({
      isFetched: false,
      isLoading: false,
      error: 'error',
      refetch: refetchApplicationExplore,
      data: { data: undefined },
    }));

    const { result } = renderHook(() => useGetDefaultApplication());
    expect(result.current).toEqual(
      expect.objectContaining({
        applications: [],
        isLoading: false,
        error: 'error',
        isFetched: false,
      })
    );
  });

  it('should re-invoke meta and exploration queries if only there is an error', async () => {
    useBlockchainApplicationMeta.mockImplementation(() => ({
      isFetched: true,
      isLoading: false,
      error: null,
      refetch: refetchBlockchainApplicationMeta,
      data: { data: mockBlockchainAppMeta.data },
    }));
    useBlockchainApplicationExplore.mockImplementation(() => ({
      isFetched: false,
      isLoading: false,
      error: 'error',
      refetch: refetchApplicationExplore,
      data: { data: undefined },
    }));

    const { result } = renderHook(() => useGetDefaultApplication());
    result.current.retry();
    expect(refetchBlockchainApplicationMeta).toHaveBeenCalled();
    expect(refetchApplicationExplore).toHaveBeenCalled();
  });

  it('should not re-invoke meta and exploration queries if there is no error', async () => {
    useBlockchainApplicationMeta.mockImplementation(() => ({
      isFetched: true,
      isLoading: false,
      error: null,
      refetch: refetchBlockchainApplicationMeta,
      data: { data: mockBlockchainAppMeta.data },
    }));
    useBlockchainApplicationExplore.mockImplementation(() => ({
      isFetched: true,
      isLoading: false,
      error: null,
      refetch: refetchApplicationExplore,
      data: { data: undefined },
    }));

    const { result } = renderHook(() => useGetDefaultApplication());
    result.current.retry();
    expect(refetchBlockchainApplicationMeta).not.toHaveBeenCalled();
    expect(refetchApplicationExplore).not.toHaveBeenCalled();
  });

  it('should be in loading state', async () => {
    useBlockchainApplicationMeta.mockImplementation(() => ({
      isFetched: false,
      isLoading: true,
      error: null,
      refetch: refetchBlockchainApplicationMeta,
      data: {},
    }));
    useBlockchainApplicationExplore.mockImplementation(() => ({
      isFetched: false,
      isLoading: false,
      error: null,
      refetch: refetchApplicationExplore,
      data: {},
    }));

    const { result } = renderHook(() => useGetDefaultApplication());
    expect(result.current.isLoading).toEqual(true);
    expect(result.current.isFetched).toEqual(false);
  });
});
