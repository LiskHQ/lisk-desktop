import React, { useCallback } from 'react';
import { getLogo } from '@token/fungible/utils/helpers';
import { TertiaryButton } from 'src/theme/buttons';
import Icon from 'src/theme/Icon';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import routes from 'src/routes/routes';
import Network from '@common/components/bars/topBar/networkName';
import { useCurrentApplication } from '../../hooks/useCurrentApplication';
import styles from './NetworkApplicationDropDownButton.css';

const NetworkApplicationDropDownButton = ({ history, location }) => {
  const [currentApplication] = useCurrentApplication();

  const handleShowApplications = useCallback(() => {
    addSearchParamsToUrl(history, { modal: 'manageApplications' });
  }, []);

  const isNotOnRegisterPath = routes.register.path !== location.pathname;

  if (!isNotOnRegisterPath) return null;

  return (
    <div className={styles.container}>
      <TertiaryButton
        className={`application-management-dropdown ${styles.wrapper}`}
        onClick={handleShowApplications}
      >
        <div className={styles.chainContainer}>
          <div className={styles.chainLogo}>
            <img src={getLogo({ logo: currentApplication?.logo || {} })} />
          </div>
          <span className={styles.chainLabel}>{currentApplication?.chainName}</span>
        </div>
        <Network className={styles.networkProp} />
        <Icon name="dropdownArrowIcon" />
      </TertiaryButton>
    </div>
  );
};
export default NetworkApplicationDropDownButton;
