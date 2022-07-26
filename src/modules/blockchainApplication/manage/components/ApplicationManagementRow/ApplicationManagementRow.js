import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TertiaryButton } from 'src/theme/buttons';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import Tooltip from 'src/theme/Tooltip';
import Icon from 'src/theme/Icon';
import styles from './ApplicationManagementRow.css';
import chainLogo from '../../../../../../setup/react/assets/images/LISK.png';
import { usePinBlockchainApplication } from '../../hooks/usePinBlockchainApplication';
import { useCurrentApplication } from '../../hooks/useCurrentApplication';

const RightRowComponent = ({
  isCurrentApplication, isTerminated, handleDeleteApplication, isDefault,
}) => {
  const { t } = useTranslation();

  if (isCurrentApplication) return <Icon name="okIcon" />;

  return (
    <div>
      {isTerminated && (
        <Tooltip
          className={styles.disabledWarningTooltip}
          size="s"
          position="left"
          content={(
            <Icon
              className={styles.disabledWarning}
              name="cautionFilledIcon"
            />
          )}
        >
          <p>
            {t('Application is terminated and can no longer be managed.')}
            <a href="https://lisk.com/blog/research/lifecycle-sidechain-lisk-ecosystem" target="_blank">
              {t('Read more')}
            </a>
          </p>
        </Tooltip>
      )}
      {isDefault ? (
        <Tooltip
          className={styles.deleteBtnTooltip}
          size="s"
          position="left"
          content={(
            <TertiaryButton
              disabled
              className={`remove-application-button ${styles.diabledDeleteBtn}`}
              onClick={handleDeleteApplication}
              size="m"
            >
              <Icon name="remove" />
            </TertiaryButton>
          )}
        >
          <p>
            {t('The default application can not be removed')}
          </p>
        </Tooltip>
      ) : (
        <TertiaryButton
          className={`remove-application-button ${styles.deleteBtn}`}
          onClick={handleDeleteApplication}
          size="m"
        >
          <Icon name="remove" />
        </TertiaryButton>
      )}
    </div>
  );
};

const ApplicationManagementRow = ({
  application, history, location,
}) => {
  const { togglePin, checkPinByChainId } = usePinBlockchainApplication();
  const [currentApplication, setApplication] = useCurrentApplication();

  const isPinned = useMemo(() => checkPinByChainId(application.chainID), [checkPinByChainId]);
  const isCurrentApplication = useMemo(
    () => currentApplication?.chainID === application.chainID,
    [currentApplication, application],
  );
  const isTerminated = useMemo(() => application.state === 'terminated', [application.state]);

  const handleTogglePin = useCallback((event) => {
    event.stopPropagation();
    togglePin(application.chainID);
  }, []);

  const handleDeleteApplication = useCallback((event) => {
    event.stopPropagation();
    addSearchParamsToUrl(history, { modal: `removeApplicationFlow&chainId=${application.chainID}` });
  }, [location]);

  const handleSetCurrentApplication = useCallback(() => {
    // Check apis here
    if (!isTerminated) {
      if (application.apis.length > 1) {
        // redirect to select node
      }
      setApplication(application);
    }
  }, [setApplication, isTerminated]);

  return (
    <div
      className={`managed-application-row ${styles.appItemWrapper} ${isCurrentApplication ? styles.activeAppBg : ''} ${isTerminated ? styles.termiated : ''}`}
      onClick={handleSetCurrentApplication}
    >
      <div className={styles.leftWrapper}>
        {!isTerminated && (
          <div className={`${styles.pinWrapper} ${isPinned ? styles.show : ''}`}>
            <TertiaryButton className="blockchain-application-pin-button" onClick={handleTogglePin}>
              <Icon data-testid="pin-button" name={isPinned ? 'pinnedIcon' : 'unpinnedIcon'} />
            </TertiaryButton>
          </div>
        )}
        <img className={styles.chainLogo} src={chainLogo} />
        <span>{application.name}</span>
      </div>
      <div className={styles.rightWrapper} align="right">
        <RightRowComponent
          isCurrentApplication={isCurrentApplication}
          isTerminated={isTerminated}
          handleDeleteApplication={handleDeleteApplication}
          isDefault={application.isDefault}
        />
      </div>
    </div>
  );
};

export default ApplicationManagementRow;
