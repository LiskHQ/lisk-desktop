/* eslint-disable max-statements */
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useApplicationManagement,
  useCurrentApplication,
} from '@blockchainApplication/manage/hooks';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { PrimaryButton } from 'src/theme/buttons';
import Icon from 'src/theme/Icon';
import routes from 'src/routes/routes';
import styles from './SelectNetwork.css';
import NetworkSwitcherDropdown from '../networkSwitcherDropdown';

function SelectNetwork({ history }) {
  const { t } = useTranslation();
  const { setApplications } = useApplicationManagement();
  const [, setCurrentApplication] = useCurrentApplication();
  const [applicationState, setApplicationState] = useState({
    isErrorGettingApplication: false,
    isGettingApplication: true,
  });
  const [selectedNetworkState, setSelectedNetworkState] = useState({
    isGettingNetworkStatus: true,
  });

  const onLoadApplications = ({
    applications,
    isErrorGettingApplication,
    isGettingApplication,
  }) => {
    setApplicationState({
      applications,
      isErrorGettingApplication,
      isGettingApplication,
    });
  };

  const onLoadNetworkStatus = ({ isGettingNetworkStatus, selectedNetworkStatusData }) => {
    setSelectedNetworkState({ isGettingNetworkStatus, selectedNetworkStatusData });
  };

  const goToDashboard = useCallback(() => {
    const { applications } = applicationState || {};
    const { selectedNetworkStatusData } = selectedNetworkState || {};
    const mainChain = applications.find(
      ({ chainID }) => chainID === selectedNetworkStatusData?.chainID
    );

    setApplications(applications || []);
    if (mainChain) {
      setCurrentApplication(mainChain);
      history.push(routes.dashboard.path);
    }
  }, [applicationState.applications, selectedNetworkState]);

  return (
    <div className={`${styles.selectNetworkWrapper} ${grid.row}`}>
      <div
        className={`${styles.selectNetwork} ${grid['col-xs-12']} ${grid['col-md-8']} ${grid['col-lg-6']}`}
      >
        <div className={styles.wrapper}>
          <div className={styles.headerWrapper}>
            <h1 data-testid="manage-title">{t('Switch Network')}</h1>
          </div>
          <div className={styles.contentWrapper}>
            <p className={styles.subHeader}>
              {t(
                '"Lisk" will be the default mainchain application, please select your preferred network for accessing the wallet. Once selected please click on "Continue to dashboard".'
              )}
            </p>
            <div>
              <Icon name="liskLogoWhiteNormalized" />
            </div>
            <h6>Lisk</h6>
          </div>
          <NetworkSwitcherDropdown
            onLoadApplications={onLoadApplications}
            onLoadNetworkStatus={onLoadNetworkStatus}
          />
          <PrimaryButton
            className={`${styles.button} ${styles.continueBtn}`}
            onClick={goToDashboard}
            disabled={
              selectedNetworkState.isGettingNetworkStatus ||
              applicationState.isGettingApplication ||
              applicationState.isErrorGettingApplication
            }
          >
            {t('Continue to dashbord')}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

export default SelectNetwork;
