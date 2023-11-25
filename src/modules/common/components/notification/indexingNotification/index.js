import React, { useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { ApplicationBootstrapContext } from '@setup/react/app/ApplicationBootstrap';

const IndexingNotification = () => {
  const { t } = useTranslation();
  const {
    indexStatus: { percentageIndexed },
  } = useContext(ApplicationBootstrapContext);

  useEffect(() => {
    if (percentageIndexed < 100) {
      toast.info(<div>{t(`Network currently indexing... Progress - ${percentageIndexed}%`)}</div>, {
        autoClose: false,
        draggable: false,
        closeButton: false,
        toastId: 'indexStatus',
      });
    }
  }, [percentageIndexed]);

  return null;
};

export default IndexingNotification;
