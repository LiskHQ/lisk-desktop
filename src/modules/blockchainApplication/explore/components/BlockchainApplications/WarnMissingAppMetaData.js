import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'src/theme/Theme';
import classNames from 'classnames';
import FlashMessage from 'src/theme/flashMessage/flashMessage';
import Icon from 'src/theme/Icon';
import styles from './WarnMissingAppMetaData.css';

const sideChainRegistrationLink =
  'https://lisk.com/documentation/beta/build-blockchain/register-sidechain.html#register-off-chain-data-in-the-app-registry';

const WarnMissingAppMetaData = (props) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <FlashMessage shouldShow hasCloseAction={false} {...props} className={styles.flashContainer}>
      <FlashMessage.Content>
        <div className={`${styles.container} ${theme === 'dark' ? theme : ''}`}>
          <Icon name="warningYellow" />
          {t(
            "Kindly provide your sidechain's off-chain metadata to empower sidechain users in seamlessly managing the application within their wallets."
          )}
          <div className={styles.btnContainer}>
            <a
              href={sideChainRegistrationLink}
              target="_blank"
              onClick={props.registerApplication}
              className={classNames(styles.button, { [theme]: theme === 'dark' })}
            >
              {t('Complete registration')}
            </a>
          </div>
        </div>
      </FlashMessage.Content>
    </FlashMessage>
  );
};

export default WarnMissingAppMetaData;
