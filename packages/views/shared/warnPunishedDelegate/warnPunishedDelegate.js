import React, { useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import routes from '@screens/router/routes';
import { useTheme } from '@views/utilities/theme';
import { SecondaryButton } from '@basics/buttons';
import FlashMessage from '@basics/flashMessage/flashMessage';
import FlashMessageHolder from '@basics/flashMessage/holder';
import Icon from '@basics/icon';
import styles from './warnPunishedDelegate.css';

const WarnPunishedDelegate = ({
  t,
  isBanned,
  history,
  daysLeft,
  readMore,
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
    ? t(
      'This delegate has been permanently banned',
    )
    : t(
      'Caution! This delegate was punished on {{punishmentStartDate}}. There is approximately {{daysLeft}} days remaining before the punishment ends.',
      { punishmentStartDate, daysLeft },
    );

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
            <SecondaryButton
              className={`${styles.button} ${theme === 'dark' ? theme : ''}`}
              size="s"
              onClick={readMore}
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
  readMore: PropTypes.func.isRequired,
};

export default withTranslation()(WarnPunishedDelegate);
