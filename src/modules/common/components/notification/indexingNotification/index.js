import React, { useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { ApplicationBootstrapContext } from '@setup/react/app/ApplicationBootstrap';

const IndexingNotification = () => {
  const { t } = useTranslation();
  const {
    indexStatus: { percentageIndexed, isIndexingInProgress },
  } = useContext(ApplicationBootstrapContext);

  useEffect(() => {
    if (percentageIndexed < 100) {
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
