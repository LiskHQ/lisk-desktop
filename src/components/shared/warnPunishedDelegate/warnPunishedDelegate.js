import React, { useEffect } from 'react';
import moment from 'moment';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { routes } from '@constants';
import { useTheme } from '@utils/theme';
import FlashMessage from '@toolbox/flashMessage/flashMessage';
import FlashMessageHolder from '@toolbox/flashMessage/holder';
import { SecondaryButton } from '@toolbox/buttons';
import Icon from '@toolbox/icon';
import styles from './warnPunishedDelegate.css';

const getPunishmentDetails = (punishedTimestamp, pomHeights) => {
  const { start, end } = pomHeights && pomHeights[pomHeights.length - 1];
  const startDate = new Date(punishedTimestamp * 1000);
  const punishmentStartDate = moment(startDate).format('MM.DD.YYYY');
  // 10: block slot interval, 60: minutes, 24: hours
  const numOfBlockPerDay = 10 * 60 * 24;
  const daysLeft = Math.ceil((end - start) / numOfBlockPerDay);

  return { daysLeft, punishmentStartDate };
};

const getMessage = ({
  isBanned, daysLeft, punishmentStartDate, t,
}) => (isBanned
  ? t('This delegate has been permanently banned from {{punishmentStartDate}}', { punishmentStartDate })
  : t('Caution! This delegate has been punished for {{daysLeft}} days starting from {{punishmentStartDate}}', { daysLeft, punishmentStartDate })
);

const WarnPunishedDelegate = ({
  t,
  isBanned,
  pomHeights,
  timestamp,
  history,
  editVote,
  ...props
}) => {
  const theme = useTheme();
  const { daysLeft, punishmentStartDate } = getPunishmentDetails(
    timestamp.data.timestamp,
    pomHeights,
  );

  useEffect(() => {
    timestamp.loadData();
  }, []);

  useEffect(() => {
    if (history.location.pathname !== routes.account.path) {
      FlashMessageHolder.deleteMessage('WarnPunishedDelegate');
    }
  }, [history.location.pathname]);

  const message = getMessage({
    isBanned, daysLeft, punishmentStartDate, t,
  });

  if (editVote) {
    return (
      <div className={styles.editVoteContainer}>
        <Icon name="warningYellow" />
        {t(
          'Caution! You are about to vote for the punished delegate, this will result in your LSK tokens being locked for a period of {{lockedTime}} days. In addition, please note that your vote will not be counted until the {{daysLeft}} day period has expired.',
          {
            lockedTime: 'XX',
            daysLeft,
          },
        )}
      </div>
    );
  }

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
