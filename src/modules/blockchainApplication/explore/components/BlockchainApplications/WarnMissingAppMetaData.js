import React from 'react';
import { useTranslation, withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useTheme } from 'src/theme/Theme';
import { SecondaryButton } from 'src/theme/buttons';
import FlashMessage from 'src/theme/flashMessage/flashMessage';
import Icon from 'src/theme/Icon';
import styles from './WarnMissingAppMetaData.css';

const WarnMissingAppMetaData = ({ registerApplication, ...props }) => {
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
            <SecondaryButton
              className={`${styles.button} ${theme === 'dark' ? theme : ''}`}
              size="s"
              onClick={registerApplication}
            >
              {t('Complete registration')}
            </SecondaryButton>
          </div>
        </div>
      </FlashMessage.Content>
    </FlashMessage>
  );
};

WarnMissingAppMetaData.propTypes = {
  registerApplication: PropTypes.func.isRequired,
};

export default withTranslation()(WarnMissingAppMetaData);
