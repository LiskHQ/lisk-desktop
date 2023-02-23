import React, { useEffect, useState } from 'react';
import {
  useGetDefaultApplication,
  useApplicationManagement,
  useCurrentApplication,
} from '@blockchainApplication/manage/hooks';
import { useTransactionUpdate } from '@transaction/hooks';
import { PrimaryButton } from 'src/theme/buttons';

const ApplicationBootstrap = ({ children }) => {
  const {
    applications: defaultApps = [],
    isFetched,
    error,
    isLoading,
    retry,
  } = useGetDefaultApplication();
  const { setApplications } = useApplicationManagement();
  const [, setCurrentApplication] = useCurrentApplication();
  const [isFirstTimeLoading, setIsFirstTimeLoading] = useState(true);

  useTransactionUpdate();

  useEffect(() => {
    if (defaultApps.length && isFetched && isFirstTimeLoading) {
      setCurrentApplication(defaultApps[0]);
      setApplications(defaultApps);
      setIsFirstTimeLoading(false);
    }
  }, [isFetched]);

  if (error) {
    // @TODO: this return should be replaced with an actual error message page
    return (
      <div>
        error
        <PrimaryButton onClick={retry}>Retry</PrimaryButton>
      </div>
    );
  }

  return (!isLoading && isFetched) || !isFirstTimeLoading ? children : null;
};

export default ApplicationBootstrap;
