import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import routes from 'src/routes/routes';
import { useTheme } from 'src/theme/Theme';
import { SecondaryButton } from 'src/theme/buttons';
import FlashMessage from 'src/theme/flashMessage/flashMessage';
import FlashMessageHolder from 'src/theme/flashMessage/holder';
import Icon from 'src/theme/Icon';
import styles from './WarnPunishedValidator.css';

const WarnPunishedValidator = ({
  t,
  isBanned,
  daysLeft,
  readMore,
  punishmentStartDate,
  ...props
}) => {
  const history = useHistory();
  const theme = useTheme();

  useEffect(() => {
    if (history.location.pathname !== routes.validatorProfile.path) {
      FlashMessageHolder.deleteMessage('WarnPunishedValidator');
    }
  }, [history.location.pathname]);

  const message = isBanned
    ? t('This validator has been permanently banned')
    : t(
        'Caution! This validator was punished on {{punishmentStartDate}}. There is approximately {{daysLeft}} days remaining before the punishment ends.',
        { punishmentStartDate, daysLeft }
      );

  return (
    <FlashMessage shouldShow hasCloseAction={false} {...props} className={styles.flashContainer}>
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

WarnPunishedValidator.propTypes = {
  readMore: PropTypes.func.isRequired,
};

export default withTranslation()(WarnPunishedValidator);
