import React, { useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { routes } from '@constants';
import { useTheme } from '@utils/theme';
import FlashMessage from '@toolbox/flashMessage/flashMessage';
import FlashMessageHolder from '@toolbox/flashMessage/holder';
// import { SecondaryButton } from '@toolbox/buttons';
import Icon from '@toolbox/icon';
import styles from './warnPunishedDelegate.css';

const WarnPunishedDelegate = ({
  t,
  isBanned,
  history,
  daysLeft,
  punishmentStartDate,
  ...props
}) => {
  const theme = useTheme();

  useEffect(() => {
    if (history.location.pathname !== routes.account.path) {
      FlashMessageHolder.deleteMessage('WarnPunishedDelegate');
    }
  }, [history.location.pathname]);

  const message = isBanned
    ? t('This delegate has been permanently banned from {{punishmentStartDate}}', { punishmentStartDate })
    : t('Caution! This delegate was punished on {{punishmentStartDate}}. There is approximately {{daysLeft}} days remaining before the punishment ends.', { punishmentStartDate, daysLeft });

  return (
    <FlashMessage
      shouldShow
      hasCloseAction={false}
      {...props}
      className={styles.flashContainer}
    >
      <FlashMessage.Content>
        <div className={`${styles.container} ${theme === 'dark' ? theme : ''}`}>
          <Icon name="warningYellow" />
          {`${message}`}
          <div className={styles.btnContainer}>
            {/* TODO: re-enable button when readmore blog content becomes available. */}
            {/* <SecondaryButton
              className={`${styles.button} ${theme === 'dark' ? theme : ''}`}
              size="s"
            >
              {t('Read more')}
            </SecondaryButton> */}
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
