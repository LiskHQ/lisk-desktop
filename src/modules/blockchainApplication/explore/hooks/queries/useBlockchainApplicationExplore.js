import { useMemo } from 'react';
import { usePinBlockchainApplication } from 'src/modules/blockchainApplication/manage/hooks';
import useApplications from './useApplications';

/**
 * Hook that handle all the logic related to blockchain applications explorer.
 * @returns {Object} Available blockchain applications array.
 */
export default function useBlockchainApplicationExplore() {
  const applicationsQuery = useApplications();

  const { pins, checkPinByChainId } = usePinBlockchainApplication();

  const applications = useMemo(() => {
    const data = applicationsQuery.data?.data.map((app) => ({
      ...app,
      isPinned: checkPinByChainId(app.chainID),
    }));

    return { ...applicationsQuery, data, meta: applicationsQuery.data?.meta };
  }, [applicationsQuery, pins, checkPinByChainId]);

  return applications
}
