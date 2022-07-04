import React, { useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import routes from 'src/routes/routes';
import { useTheme } from 'src/theme/Theme';
import { SecondaryButton } from 'src/theme/buttons';
import FlashMessage from 'src/theme/flashMessage/flashMessage';
import FlashMessageHolder from 'src/theme/flashMessage/holder';
import Icon from 'src/theme/Icon';
import styles from './WarnPunishedDelegate.css';

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
    if (history.location.pathname !== routes.explorer.path) {
      FlashMessageHolder.deleteMessage('WarnPunishedDelegate');
    }
  }, [history.location.pathname]);

  const message = isBanned
    ? t('This delegate has been permanently banned')
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
