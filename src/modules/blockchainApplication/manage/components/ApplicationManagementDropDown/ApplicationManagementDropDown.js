import React, { useCallback } from 'react';
import { getLogo } from 'src/redux/actions';
import { TertiaryButton } from 'src/theme/buttons';
import Icon from 'src/theme/Icon';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import { useCurrentApplication } from '../../hooks/useCurrentApplication';
import styles from './ApplicationManagementDropDown.css';

const ApplicationManagementList = ({ history }) => {
  const [currentApplication] = useCurrentApplication();

  const handleShowApplications = useCallback(() => {
    addSearchParamsToUrl(history, { modal: 'manageApplications' });
  }, []);

  return (
    <div className={styles.container}>
      <TertiaryButton
        className={`application-management-dropdown ${styles.wrapper}`}
        onClick={handleShowApplications}
      >
        <div className={styles.chainLogo}>
          <img src={getLogo({ logo: currentApplication?.logo || {} })} />
        </div>
        <span>{currentApplication?.chainName}</span>
        <Icon name="dropdownArrowIcon" />
      </TertiaryButton>
    </div>
  );
};
export default ApplicationManagementList;
