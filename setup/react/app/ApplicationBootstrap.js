import React, { useEffect } from 'react';
import client from 'src/utils/api/client';
import { METADATA_HOST } from 'src/const/config';
import {
  useApplicationExploreAndMetaData,
  useApplicationManagement,
  useCurrentApplication,
} from '@blockchainApplication/manage/hooks';

const ApplicationBootstrap = ({ children }) => {
  const { applications = [], isFetched, error, isLoading } = useApplicationExploreAndMetaData();
  const { setApplications } = useApplicationManagement();
  const [, setCurrentApplication] = useCurrentApplication();

  useEffect(() => {
    // Initialize client on first render to get default application
    client.create({
      http: METADATA_HOST.http,
      ws: METADATA_HOST.ws,
    });
  }, []);

  useEffect(() => {
    if (applications.length) {
      setCurrentApplication(applications[0]);
      setApplications(applications);
    }
  }, [isFetched]);

  if (isLoading) return <div> Loading ... </div>;
  if (error) return <div>error</div>;

  return children;
};

export default ApplicationBootstrap;
