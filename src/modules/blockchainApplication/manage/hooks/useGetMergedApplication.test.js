import { renderHook } from '@testing-library/react-hooks';
import mockApplicationsExplore from '@tests/fixtures/blockchainApplicationsExplore';
import { mockBlockchainAppMeta } from '@blockchainApplication/manage/__fixtures__';
import { useBlockchainApplicationExplore } from '../../explore/hooks/queries/useBlockchainApplicationExplore';
import { useBlockchainApplicationMeta } from './queries/useBlockchainApplicationMeta';
import { useGetMergedApplication } from './useGetMergedApplication';

jest.mock('src/utils/api/client');
const mockDispatch = jest.fn();
const mockState = {
  network: {
    name: 'mainnet',
    status: { online: true },
  },
};
const refetchBlockchainApplicationMeta = jest.fn();
const refetchApplicationExpore = jest.fn();

jest.mock('react-redux', () => ({
  useSelector: jest.fn().mockImplementation((fn) => fn(mockState)),
  useDispatch: () => mockDispatch,
}));

jest.mock('../../explore/hooks/queries/useBlockchainApplicationExplore');
jest.mock('./queries/useBlockchainApplicationMeta');

describe('useGetMergedApplication hook', () => {
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
      refetch: refetchApplicationExpore,
      data: { data: mockApplicationsExplore },
    }));

    const applications = mockBlockchainAppMeta.data.map(({ chainID, ...restApplication }) => ({
      chainID,
      ...restApplication,
      ...mockApplicationsExplore.find((app) => app.chainID === chainID),
    }));

    const { result } = renderHook(() => useGetMergedApplication());
    expect(result.current).toEqual(
      expect.objectContaining({
        data: applications[0],
        isLoading: false,
        isError: false,
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
      refetch: refetchApplicationExpore,
      data: { data: [] },
    }));

    const { result } = renderHook(() => useGetMergedApplication());
    expect(result.current).toEqual(
      expect.objectContaining({
        data: mockBlockchainAppMeta.data[0],
        isLoading: false,
        isError: false,
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
      refetch: refetchApplicationExpore,
      data: { data: [] },
    }));

    const { result } = renderHook(() => useGetMergedApplication());
    expect(result.current).toEqual(
      expect.objectContaining({
        data: undefined,
        isLoading: false,
        isError: true,
        isFetched: false,
      })
    );
  });

  it('should not return merged application if appliation explore returns a server error', async () => {
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
      refetch: refetchApplicationExpore,
      data: { data: undefined },
    }));

    const { result } = renderHook(() => useGetMergedApplication());
    expect(result.current).toEqual(
      expect.objectContaining({
        data: undefined,
        isLoading: false,
        isError: true,
        isFetched: false,
      })
    );
  });

  it('should not return merged application if appliation explore returns a server error', async () => {
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
      refetch: refetchApplicationExpore,
      data: { data: undefined },
    }));

    const { result } = renderHook(() => useGetMergedApplication());
    expect(result.current).toEqual(
      expect.objectContaining({
        data: undefined,
        isLoading: false,
        isError: true,
        isFetched: false,
      })
    );
  });

  it('should re-invoke meta and exploration quries if only there is an error', async () => {
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
      refetch: refetchApplicationExpore,
      data: { data: undefined },
    }));

    const { result } = renderHook(() => useGetMergedApplication());
    result.current.retry();
    expect(refetchBlockchainApplicationMeta).toHaveBeenCalled();
    expect(refetchApplicationExpore).toHaveBeenCalled();
  });

  it('should not re-invoke meta and exploration quries if there is no error', async () => {
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
      refetch: refetchApplicationExpore,
      data: { data: undefined },
    }));

    const { result } = renderHook(() => useGetMergedApplication());
    result.current.retry();
    expect(refetchBlockchainApplicationMeta).not.toHaveBeenCalled();
    expect(refetchApplicationExpore).not.toHaveBeenCalled();
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
      refetch: refetchApplicationExpore,
      data: {},
    }));

    const { result } = renderHook(() => useGetMergedApplication());
    expect(result.current.isLoading).toEqual(true);
    expect(result.current.isFetched).toEqual(false);
  });
});
