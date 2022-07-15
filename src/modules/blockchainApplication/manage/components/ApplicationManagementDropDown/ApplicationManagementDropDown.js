import React from 'react';
import { TertiaryButton } from 'src/theme/buttons';
import Icon from 'src/theme/Icon';
import { useCurrentApplication } from '../../hooks/useCurrentApplication';
import chainLogo from '../../../../../../setup/react/assets/images/LISK.png';

import styles from './ApplicationManagementDropDown.css';

const ApplicationManagementList = () => {
  const [currentApplication] = useCurrentApplication();
  return (
    <TertiaryButton className={styles.wrapper}>
      <img src={chainLogo} />
      <span>{currentApplication?.name || 'Lisk'}</span>
      <Icon name="dropdownArrowIcon" />
    </TertiaryButton>
  );
};
export default ApplicationManagementList;
