import React, { useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { ApplicationBootstrapContext } from '@setup/react/app/ApplicationBootstrap';
import styles from './styles.css';

const IndexingNotification = () => {
  const { t } = useTranslation();
  const {
    indexStatus: { percentageIndexed, isIndexingInProgress, chainLength, numBlocksIndexed },
  } = useContext(ApplicationBootstrapContext);

  useEffect(() => {
    if (chainLength - numBlocksIndexed >= 5) {
      toast.info(
        <div className={styles.indexingInfo}>
          <p>{t(`Blockchain client syncing: ${isIndexingInProgress}`)}</p>
          <p>{t(`Service indexing progress: ${percentageIndexed}%`)}</p>
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
