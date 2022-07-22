import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import { OutlineButton } from 'src/theme/buttons';
import Icon from 'src/theme/Icon';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import styles from './ApplicationManagementList.css';
import useApplicationManagement from '../../hooks/useApplicationManagement';
import ApplicationManagementRow from '../ApplicationManagementRow';

const ApplicationManagementList = ({ history }) => {
  const { t } = useTranslation();
  const { applications } = useApplicationManagement();

  const handleAddApplication = useCallback(() => {
    addSearchParamsToUrl(history, { modal: 'blockChainApplicationAddList' });
  }, []);

  return (
    <Box className={styles.wrapper}>
      <BoxHeader>
        <h1>{t('Applications')}</h1>
      </BoxHeader>
      <BoxContent className={styles.applicationListContainer}>
        <div className={styles.listWrapper}>
          {applications.map((application) => (
            <ApplicationManagementRow
              key={`application-list-${application.chainID}`}
              application={application}
            />
          ))}
        </div>
      </BoxContent>
      <OutlineButton
        className={styles.addApplicationBtn}
        onClick={handleAddApplication}
      >
        <Icon name="plusBlueIcon" />
        <span>{t('Add application')}</span>
      </OutlineButton>
    </Box>
  );
};

export default ApplicationManagementList;
