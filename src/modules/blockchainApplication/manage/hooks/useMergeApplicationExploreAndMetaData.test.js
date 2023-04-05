import { renderHook } from '@testing-library/react-hooks';
import lodashMerge from 'lodash.merge';
import blockchainApplicationsExplore from '@tests/fixtures/blockchainApplicationsExplore';
import blockchainApplicationsManage from '@tests/fixtures/blockchainApplicationsManage';
import { useBlockchainApplicationMeta } from './queries/useBlockchainApplicationMeta';
import useMergeApplicationExploreAndMetaData from './useMergeApplicationExploreAndMetaData';

jest.mock('./queries/useBlockchainApplicationMeta');

describe('useMergeApplicationExploreAndMetaData', () => {
  const apps = blockchainApplicationsExplore;

  it('returns the on-chain data', () => {
    useBlockchainApplicationMeta.mockReturnValue({
      data: {},
      isLoading: true,
    });
    const { result } = renderHook(() => useMergeApplicationExploreAndMetaData(apps));

    expect(result.current).toBe(apps);
  });

  it('returns the merged data', () => {
    const appMetaData = blockchainApplicationsManage.slice(0, 2);
    useBlockchainApplicationMeta.mockReturnValue({
      data: { data: appMetaData },
      isLoading: false,
    });
    const { result } = renderHook(() => useMergeApplicationExploreAndMetaData(apps));
    const mergedAppData = lodashMerge(apps, appMetaData);
    expect(result.current).toBe(mergedAppData);
  });
});
