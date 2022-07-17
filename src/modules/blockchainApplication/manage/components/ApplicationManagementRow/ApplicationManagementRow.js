import React, { useCallback, useMemo } from 'react';
import { withRouter } from 'react-router';
import { useTranslation } from 'react-i18next';
import { TertiaryButton } from 'src/theme/buttons';
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
      {isDefault ? (
        <Tooltip
          className={styles.deleteBtnTooltip}
          content={(
            <TertiaryButton
              disabled
              className={styles.diabledDeleteBtn}
              onClick={handleDeleteApplication}
              size="m"
            >
              <Icon name="remove" />
            </TertiaryButton>
          )}
          size="s"
          position="left"
        >
          <p>
            {t('The default application can not be removed')}
          </p>
        </Tooltip>
      ) : (
        <TertiaryButton
          className={styles.deleteBtn}
          onClick={handleDeleteApplication}
          size="m"
        >
          <Icon name="remove" />
        </TertiaryButton>
      )}
      {isTerminated && (
        <Tooltip
          className={styles.disabledWarningTooltip}
          content={(
            <Icon
              className={styles.disabledWarning}
              name="cautionFilledIcon"
            />
          )}
          size="s"
          position="left"
        >
          <p>
            {t('Application is terminated and can no longer be managed.')}
            <p>
              <a>
                {t('Read more')}
              </a>
            </p>
          </p>
        </Tooltip>
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
    () => currentApplication?.chainID === application?.chainID,
    [currentApplication],
  );
  const isTerminated = useMemo(() => application?.state === 'terminated', []);

  const handleTogglePin = useCallback((event) => {
    event.stopPropagation();
    togglePin(application.chainID);
  }, []);

  const handleDeleteApplication = useCallback((event) => {
    event.stopPropagation();
    history.push({ pathname: location.pathname, search: `?modal=removeApplicationFlow&chainId=${application.chainID}` });
  }, []);

  const handleSetCurrentApplication = useCallback(() => {
    if (!isTerminated) setApplication(application);
  }, []);

  return (
    <div
      className={`${styles.appItemWrapper} ${isCurrentApplication ? styles.activeAppBg : ''} ${isTerminated ? styles.termiated : ''}`}
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

export default withRouter(ApplicationManagementRow);
