import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrentApplication } from '@blockchainApplication/manage/hooks/useCurrentApplication';
import mockBlockchainApplications from '@tests/fixtures/blockchainApplicationsExplore';
import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import { OutlineButton, TertiaryButton } from 'src/theme/buttons';
import Icon from 'src/theme/Icon';
import styles from './applicationManagementList.css';
import chainLogo from '../../../../../../setup/react/assets/images/LISK.png';
import { usePinBlockchainApplication } from '../../hooks/usePinBlockchainApplication';

const ApplicationListItem = ({
  key, app, isCurrentApplication, deleteApp, setApplication,
}) => {
  const { togglePin, checkPinByChainId } = usePinBlockchainApplication();
  const isPinned = useMemo(() => checkPinByChainId(app.chainID), [checkPinByChainId]);

  const handleTogglePin = useCallback((event) => {
    event.stopPropagation();
    togglePin(app.chainID);
  }, []);

  const handleDeleteApplication = useCallback((event) => {
    event.stopPropagation();
    deleteApp(app.chainId);
  }, []);

  return (
    <div
      className={`${styles.appItemWrapper} ${isCurrentApplication ? styles.activeAppBg : ''}`}
      onClick={() => setApplication(app)}
      key={key}
    >
      <div className={styles.leftWrapper}>
        <div className={`${styles.pinWrapper} ${isPinned ? styles.show : ''}`}>
          <TertiaryButton className="blockchain-application-pin-button" onClick={handleTogglePin}>
            <Icon data-testid="pin-button" name={isPinned ? 'pinnedIcon' : 'unpinnedIcon'} />
          </TertiaryButton>
        </div>
        <img className={styles.chainLogo} src={chainLogo} />
        <span>{app.name}</span>
      </div>
      <div className={styles.rightWrapper} align="right">
        {isCurrentApplication ? (
          <Icon name="okIcon" />
        ) : (
          <TertiaryButton
            className={styles.deleteBtn}
            onClick={handleDeleteApplication}
            size="m"
          >
            <Icon name="remove" />
          </TertiaryButton>
        )}
      </div>
    </div>
  );
};

const ApplicationList = ({ apps }) => {
  const [currentApplication, setApplication] = useCurrentApplication();

  return (
    <div className={styles.listWrapper}>
      {apps.map((app) => (
        <ApplicationListItem
          key={`application-list-${app.chainID}`}
          app={app}
          isCurrentApplication={currentApplication?.chainID === app?.chainID}
          setApplication={setApplication}
        />
      ))}
    </div>
  );
};

const ApplicationManagementList = () => {
  const { t } = useTranslation();
  return (
    <Box className={styles.wrapper}>
      <BoxHeader>
        <h1>{t('Applications')}</h1>
      </BoxHeader>
      <BoxContent className={styles.applicationListContainer}>
        <ApplicationList apps={mockBlockchainApplications} />
      </BoxContent>
      <OutlineButton className={styles.addApplicationBtn}>
        <Icon name="plusBlueIcon" />
        {t('Add application')}
      </OutlineButton>
    </Box>
  );
};

export default ApplicationManagementList;
