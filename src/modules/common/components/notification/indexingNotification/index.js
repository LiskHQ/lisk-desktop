import React, { useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { ApplicationBootstrapContext } from '@setup/react/app/ApplicationBootstrap';

/* istanbul ignore file */
const IndexingNotification = () => {
  const { t } = useTranslation();
  const {
    indexStatus: { percentageIndexed, isIndexingInProgress, chainLength, numBlocksIndexed },
  } = useContext(ApplicationBootstrapContext);

  useEffect(() => {
    if (chainLength - numBlocksIndexed >= 5) {
      toast.info(
        <div>
          {t(`Blockchain client syncing: ${isIndexingInProgress}`)}
          <br /> {t(`Service indexing progress: ${percentageIndexed}%`)}
        </div>,
        {
          autoClose: false,
          draggable: false,
          closeButton: false,
          delay: 1000,
          toastId: 'indexStatus',
        }
      );
    }
  }, [percentageIndexed]);

  return null;
};

export default IndexingNotification;
