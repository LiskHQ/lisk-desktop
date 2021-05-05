import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import { formatAmountBasedOnLocale } from '@utils/formattedNumber';
import { fromRawLsk } from '@utils/lsk';
import { truncateAddress } from '@utils/account';
import Tooltip from '@toolbox/tooltip/tooltip';
import Icon from '@toolbox/icon';
import AccountVisual from '@toolbox/accountVisual';
import {
  getStatusClass,
  getDelegateWeightClass,
  getRoundStateClass,
  getForgingTimeClass,
} from './tableHeader';
import styles from '../delegates.css';

const roundStatus = {
  forging: 'Forging',
  awaitingSlot: 'Awaiting slot',
  missedBlock: 'Missed block',
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
  nonEligible: 'Non-eligible to forge',
};

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
    <span className={grid['col-xs-5']}>
      <div className={styles.delegateColumn}>
        <Tooltip
          tooltipClassName={styles.tooltipContainer}
          className={styles.eyeIconTooltip}
          position="bottom right"
          size="s"
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

export const RoundStatus = ({
  activeTab, data, t, time,
}) => (
  <span className={`${getRoundStateClass(activeTab)} ${styles.noEllipsis} ${styles.statusIconsContainer}`}>
    <Tooltip
      title={t(roundStatus[data.status])}
      position="left"
      size="maxContent"
      content={(
        <Icon
          className={styles.statusIcon}
          name={icons[data.status]}
        />
      )}
      footer={(
        <p>{data.status === 'missedBlock' ? '-' : time}</p>
      )}
    >
      <p className={styles.statusToolip}>
        {data.lastBlock && `Last block forged ${data.lastBlock}`}
      </p>
    </Tooltip>
    {data.isBanned && (
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

export const DelegateStatus = ({ activeTab, data }) => {
  const status = data.totalVotesReceived < 1e11 ? 'nonEligible' : data.status;
  return (
    <span className={getStatusClass(activeTab)}>
      <span className={`${styles.delegateStatus} ${styles[status]}`}>{delegateStatus[status]}</span>
    </span>
  );
};

export const ForgingTime = ({ activeTab, time, status }) => (
  <span className={getForgingTimeClass(activeTab)}>
    {status === 'missedBlock' ? '-' : time}
  </span>
);
