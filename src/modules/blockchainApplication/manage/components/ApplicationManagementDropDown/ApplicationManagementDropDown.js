import React, { useCallback } from 'react';
import { TertiaryButton } from 'src/theme/buttons';
import Icon from 'src/theme/Icon';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import { useCurrentApplication } from '../../hooks/useCurrentApplication';
import chainLogo from '../../../../../../setup/react/assets/images/LISK.png';
import styles from './ApplicationManagementDropDown.css';

const ApplicationManagementList = ({ history }) => {
  const [currentApplication] = useCurrentApplication();

  const handleShowApplications = useCallback(() => {
    addSearchParamsToUrl(history, { modal: 'manageApplications' });
  }, []);

  return (
    <TertiaryButton className={`appliation-management-dropdown ${styles.wrapper}`} onClick={handleShowApplications}>
      <img src={chainLogo} />
      <span>{currentApplication?.name}</span>
      <Icon name="dropdownArrowIcon" />
    </TertiaryButton>
  );
};
export default ApplicationManagementList;
