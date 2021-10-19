import React from 'react';
import moment from 'moment';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useTheme } from '@utils/theme';
import FlashMessage from '@toolbox/flashMessage/flashMessage';
import { SecondaryButton } from '@toolbox/buttons';
import Icon from '@toolbox/icon';
import styles from './warnPunishedDelegate.css';

const WarnPunishedDelegate = ({
  t,
  readMore,
  isBanned,
  pomHeights,
  ...props
}) => {
  const theme = useTheme();

  const getPunishmentDetails = (punishedHeights, punishedTimestamp) => {
    const { start, end } = punishedHeights && punishedHeights[punishedHeights.length - 1];
    const startDate = new Date(punishedTimestamp * 1000);
    const punishmentStartDate = moment(startDate).format('MM.DD.YYYY');
    // 10: block slot interval, 60: minutes, 24: hours
    const numOfBlockPerDay = 10 * 60 * 24;
    const daysLeft = Math.ceil((end - start) / numOfBlockPerDay);

    return { daysLeft, punishmentStartDate };
  };

  const { daysLeft, punishmentStartDate } = getPunishmentDetails(pomHeights, 1629632440);

  const message = isBanned
    ? 'This delegate has been permanently banned from MM.DD.YYYY'
    : `Caution! This delegate has been punished for ${daysLeft} days starting from ${punishmentStartDate}`;

  return (
    <FlashMessage
      shouldShow
      hasCloseAction={false}
      {...props}
      className={styles.flashContainer}
    >
      <FlashMessage.Content>
        <div className={styles.container}>
          <Icon name="warningYellow" />
          {`${message}`}
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
