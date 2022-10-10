import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { OutlineButton, TertiaryButton } from 'src/theme/buttons';
import Icon from 'src/theme/Icon';
import Dropdown from 'src/theme/Dropdown/dropdown';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import { useCurrentApplication } from '../../hooks/useCurrentApplication';
import chainLogo from '../../../../../../setup/react/assets/images/LISK.png';
import styles from './ApplicationManagementDropDown.css';
import { useApplicationManagement } from '../../hooks';
import ApplicationManagementRow from '../ApplicationManagementRow';

const ApplicationManagementList = ({ history }) => {
  const [currentApplication] = useCurrentApplication();
  const { applications } = useApplicationManagement();

  console.log('applications', applications);

  const { t } = useTranslation();

  const handleAddApplication = useCallback(() => {
    addSearchParamsToUrl(history, { modal: 'addApplicationList' });
  }, []);

  return (
    <div className={styles.container}>
      <Dropdown
        align="left"
        item={() => (
          <TertiaryButton className={`application-management-dropdown ${styles.wrapper}`}>
            <img src={chainLogo} />
            <span>{currentApplication?.name}</span>
            <Icon name="dropdownArrowIcon" />
          </TertiaryButton>
        )}
        className={styles.dropdown}
        title={t('Applications')}
      >
        {applications.map((app) => (
          <ApplicationManagementRow key={app.chainName} application={app} />
        ))}
        <div className={styles.content} >
          <OutlineButton
            className={`add-application-link ${styles.addApplicationBtn}`}
            onClick={handleAddApplication}
          >
            <Icon name="plusBlueIcon" />
            <span>{t('Add application')}</span>
          </OutlineButton>
        </div>
      </Dropdown>
    </div>
  );
};
export default ApplicationManagementList;
