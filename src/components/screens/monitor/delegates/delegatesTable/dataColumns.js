import React from 'react';

import { formatAmountBasedOnLocale } from '@utils/formattedNumber';
import { fromRawLsk } from '@utils/lsk';
import { truncateAddress } from '@utils/account';
import Tooltip from '@toolbox/tooltip/tooltip';
import Icon from '@toolbox/icon';
import AccountVisual from '@toolbox/accountVisual';
import { MIN_VOTES_RECEIVED } from '@constants';
import {
  getDelegateDetailsClass,
  getStatusClass,
  getDelegateWeightClass,
  getRoundStateClass,
  getForgingTimeClass,
  getDelegateRankClass,
} from './tableHeader';
import styles from '../delegates.css';

const roundStates = {
  forging: 'Forging',
  awaitingSlot: 'Awaiting slot',
  missedBlock: 'Missed slot',
};

const icons = {
  forging: 'delegateForged',
  awaitingSlot: 'delegateAwaiting',
  missedBlock: 'delegateMissed',
};

const delegateStatus = {
  active: 'Active',
  standby: 'Standby',
  banned: 'Banned',
  punished: 'Punished',
  nonEligible: 'Ineligible',
};

export const DelegateRank = ({ data, activeTab }) => (
  <span className={getDelegateRankClass(activeTab)}>
    <span>{data.rank}</span>
  </span>
);

export const DelegateWeight = ({ value, activeTab }) => {
  const formatted = formatAmountBasedOnLocale({
    value: fromRawLsk(value),
    format: '0a',
  });

  return (
    <span className={getDelegateWeightClass(activeTab)}>
      <span>{formatted}</span>
    </span>
  );
};

export const DelegateDetails = ({
  t, watched = false, data, activeTab, removeFromWatchList, addToWatchList,
}) => {
  const showEyeIcon = activeTab === 'active' || activeTab === 'standby' || activeTab === 'watched';
  return (
    <span className={getDelegateDetailsClass(activeTab)}>
      <div className={styles.delegateColumn}>
        <Tooltip
          tooltipClassName={styles.tooltipContainer}
          className={styles.eyeIconTooltip}
          position="bottom right"
          size="maxContent"
          indent
          content={(
            <span
              className={`
                ${styles.eyeIcon} ${!showEyeIcon ? 'hidden' : ''} ${watched && showEyeIcon ? styles.watchedDelegate : ''}
              `}
              onClick={watched ? removeFromWatchList : addToWatchList}
            >
              <Icon name={watched ? 'eyeActive' : 'eyeInactive'} />
            </span>
          )}
        >
          <p className={styles.watchedTooltip}>
            {watched ? t('Remove from watched') : t('Add to watched')}
          </p>
        </Tooltip>

        <div className={`${styles.delegateDetails}`}>
          <AccountVisual address={data.address} />
          <div>
            <p className={styles.delegateName}>
              {data.username}
            </p>
            <p className={styles.delegateAddress}>{truncateAddress(data.address)}</p>
          </div>
        </div>
      </div>
    </span>
  );
};

export const RoundState = ({
  activeTab, state, isBanned, t, time,
}) => {
  // if (activeTab === 'active') console.log('lastBlock', lastBlock);
  if (state === undefined) {
    return (
      <span className={`${getRoundStateClass(activeTab)} ${styles.noEllipsis} ${styles.statusIconsContainer}`}>-</span>
    );
  }

  return (
    <span className={`${getRoundStateClass(activeTab)} ${styles.noEllipsis} ${styles.statusIconsContainer}`}>
      <Tooltip
        title={t('Round state:')}
        position="left"
        size="maxContent"
        content={<Icon className={styles.statusIcon} name={icons[state]} />}
      >
        <p className={styles.statusToolip}>
          {roundStates[state]}
        </p>
      </Tooltip>
      {isBanned && (
        <Tooltip
          position="left"
          size="maxContent"
          content={<Icon className={styles.statusIcon} name="delegateWarning" />}
          footer={(
            <p>{time}</p>
          )}
        >
          <p>
            {t('This delegate will be punished in upcoming rounds')}
          </p>
        </Tooltip>
      )}
    </span>
  );
};

const getDelegateStatus = (key, totalVotesReceived) => {
  if (key === 'banned' || key === 'punished' || key === 'active') {
    return [key, delegateStatus[key]];
  }
  if (totalVotesReceived < MIN_VOTES_RECEIVED) {
    return ['nonEligible', delegateStatus.nonEligible];
  }

  return [key, delegateStatus[key]];
};

export const DelegateStatus = ({
  activeTab, status, totalVotesReceived, theme,
}) => {
  const [key, value] = getDelegateStatus(status, totalVotesReceived);

  return (
    <span className={getStatusClass(activeTab)}>
      <span className={`${styles.delegateStatus} ${styles[key]} ${styles[theme]}`}>{value}</span>
    </span>
  );
};

export const ForgingTime = ({ activeTab, time, state }) => (
  <span className={getForgingTimeClass(activeTab)}>
    {state === 'missedBlock' ? '-' : time}
  </span>
);
