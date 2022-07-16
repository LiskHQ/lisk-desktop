import React, { useCallback } from 'react';
import { TertiaryButton } from 'src/theme/buttons';
import Icon from 'src/theme/Icon';
import { useCurrentApplication } from '../../hooks/useCurrentApplication';
import chainLogo from '../../../../../../setup/react/assets/images/LISK.png';

import styles from './ApplicationManagementDropDown.css';

const ApplicationManagementList = ({ history, location }) => {
  const [currentApplication] = useCurrentApplication();

  const handleShowApplications = useCallback(() => {
    history.push({ pathname: location.pathname, search: '?modal=manageApplications' });
  }, []);

  return (
    <TertiaryButton className={styles.wrapper} onClick={handleShowApplications}>
      <img src={chainLogo} />
      <span>{currentApplication?.name}</span>
      <Icon name="dropdownArrowIcon" />
    </TertiaryButton>
  );
};
export default ApplicationManagementList;
