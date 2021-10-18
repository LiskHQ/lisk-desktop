import React from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useTheme } from '@utils/theme';
import FlashMessage from '@toolbox/flashMessage/flashMessage';
import { SecondaryButton } from '@toolbox/buttons';
import Icon from '@toolbox/icon';
import styles from './warnPunishedDelegate.css';

const WarnPunishedDelegate = ({
  t, readMore, message, ...props
}) => {
  const theme = useTheme();

  return (
    <FlashMessage shouldShow hasCloseAction={false} {...props} className={styles.flashContainer}>
      <FlashMessage.Content>
        <div className={styles.container}>
          <Icon name="warningYellow" />
          {message}
          <div className={styles.btnContainer}>
            <SecondaryButton
              className={`${styles.button} ${theme === 'dark' ? theme : ''}`}
              size="s"
            >
              {t('Read more')}
            </SecondaryButton>
          </div>
        </div>
      </FlashMessage.Content>
    </FlashMessage>
  );
};

WarnPunishedDelegate.propTypes = {
  message: PropTypes.string.isRequired,
  readMore: PropTypes.func.isRequired,
};

export default withTranslation()(WarnPunishedDelegate);
