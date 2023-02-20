import React, { useEffect } from 'react';
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

  useTransactionUpdate();

  useEffect(() => {
    if (defaultApps.length && isFetched) {
      setCurrentApplication(defaultApps[0]);
      setApplications(defaultApps);
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

  return !isLoading && isFetched ? children : null;
};

export default ApplicationBootstrap;
