import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TertiaryButton } from 'src/theme/buttons';
import { useHistory, useLocation } from 'react-router-dom';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import Tooltip from 'src/theme/Tooltip';
import Icon from 'src/theme/Icon';
import { getLogo } from '@token/fungible/utils/helpers';
import styles from './ApplicationManagementRow.css';
import { usePinBlockchainApplication } from '../../hooks/usePinBlockchainApplication';
import { useCurrentApplication } from '../../hooks/useCurrentApplication';

const RightRowComponent = ({
  isCurrentApplication,
  isTerminated,
  handleDeleteApplication,
  isDefault,
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
          content={<Icon className={styles.disabledWarning} name="cautionFilledIcon" />}
        >
          <p>
            {t('Application is terminated and can no longer be managed.')}
            <a
              href="https://lisk.com/blog/posts/lifecycle-sidechain-lisk-ecosystem"
              rel="noopener noreferrer"
              target="_blank"
            >
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
          content={
            <TertiaryButton
              disabled
              className={`remove-application-button ${styles.disabledDeleteBtn}`}
              onClick={handleDeleteApplication}
              size="m"
            >
              <Icon name="remove" />
            </TertiaryButton>
          }
        >
          <p>{t('The default application can not be removed')}</p>
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

/* eslint max-statements: ["error", 15] */
const ApplicationManagementRow = ({ className, application }) => {
  const history = useHistory();
  const location = useLocation();
  const { togglePin, checkPinByChainId } = usePinBlockchainApplication();
  const [currentApplication, setApplication] = useCurrentApplication();

  const isPinned = useMemo(() => checkPinByChainId(application.chainID), [checkPinByChainId]);
  const isCurrentApplication = useMemo(
    () => currentApplication?.chainID === application.chainID,
    [currentApplication, application]
  );
  const isTerminated = useMemo(() => application.status === 'terminated', [application.status]);

  const handleTogglePin = useCallback((event) => {
    event.stopPropagation();
    togglePin(application.chainID);
  }, []);

  const handleDeleteApplication = useCallback(
    (event) => {
      event.stopPropagation();
      addSearchParamsToUrl(history, {
        modal: `removeApplicationFlow&chainId=${application.chainID}`,
      });
    },
    [location]
  );

  const handleSetCurrentApplication = useCallback(() => {
    // Check apis here
    if (!isTerminated) {
      if (application.serviceURLs.length > 1) {
        // redirect to select node
        addSearchParamsToUrl(history, { modal: 'selectNode', chainID: application.chainID });
      } else {
        setApplication(application);
      }
    }
  }, [setApplication, isTerminated]);

  return (
    <div
      className={`managed-application-row ${styles.appItemWrapper} ${className} ${
        isCurrentApplication ? styles.activeAppBg : ''
      } ${isTerminated ? styles.terminated : ''}`}
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
        <img className={styles.chainLogo} src={getLogo(application)} />
        <span>{application.chainName}</span>
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
