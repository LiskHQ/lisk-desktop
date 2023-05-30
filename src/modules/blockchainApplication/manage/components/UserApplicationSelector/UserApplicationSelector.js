import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApplicationManagement } from '@blockchainApplication/manage/hooks';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import ApplicationManagementRow from '@blockchainApplication/manage/components/ApplicationManagementRow';
import { OutlineButton } from '@theme/buttons';
import Icon from '@theme/Icon';
import classNames from 'classnames';
import styles from './UserApplicationSelector.css';

const UserApplicationSelector = ({ className }) => {
  const history = useHistory();
  const { t } = useTranslation();
  const { applications } = useApplicationManagement();

  const handleAddApplication = useCallback(() => {
    addSearchParamsToUrl(history, { modal: 'addApplicationList' });
  }, []);

  return (
    <div className={classNames(styles.UserApplicationSelector, className)}>
      <label className={styles.label}>{t('Switch application')}</label>
      <div className={styles.applicationListContainer}>
        <div className={styles.listWrapper}>
          {applications.map((application) => (
            <ApplicationManagementRow
              className={styles.applicationManagementRowProp}
              key={`application-list-${application.chainID}`}
              application={application}
            />
          ))}
        </div>
      </div>
      <OutlineButton
        className={`add-application-link ${styles.addApplicationBtn}`}
        onClick={handleAddApplication}
      >
        <Icon name="plusBlueIcon" />
        <span>{t('Add application')}</span>
      </OutlineButton>
    </div>
  );
};

export default UserApplicationSelector;
