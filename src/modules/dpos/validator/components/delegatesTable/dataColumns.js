import React, { useContext } from 'react';

import { formatAmountBasedOnLocale } from 'src/utils/formattedNumber';
import { fromRawLsk } from '@token/fungible/utils/lsk';
import { truncateAddress } from '@wallet/utils/account';
import WalletVisual from '@wallet/components/walletVisual';
import Tooltip from 'src/theme/Tooltip';
import Icon from 'src/theme/Icon';
import { DEFAULT_STANDBY_THRESHOLD } from '@dpos/validator/consts';
import DelegateRowContext from '../../context/delegateRowContext';
import styles from '../delegatesMonitorView/delegates.css';
import {
  getDelegateDetailsClass,
  getStatusClass,
  getDelegateWeightClass,
  getRoundStateClass,
  getForgingTimeClass,
  getDelegateRankClass,
} from './tableHeader';

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
  ineligible: 'Ineligible',
};

// const {
//   data, activeTab, watched = false, addToWatchList,
//   removeFromWatchList, value, /* watchList, setActiveTab, */
//   /* blocks, */ state, time, status, /* lastBlock, */
//   isBanned, totalVotesReceived, theme, t,
// } = useContext(DelegateRowContext);

// export const DelegateRank = ({ data, activeTab }) => (
export const DelegateRank = () => {
  const { data, activeTab } = useContext(DelegateRowContext);
  return (
    <span className={getDelegateRankClass(activeTab)}>
      <span>{data.rank}</span>
    </span>
  );
};

// export const DelegateWeight = ({ value, activeTab }) => {
export const DelegateWeight = () => {
  const { value, activeTab } = useContext(DelegateRowContext);
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

// export const DelegateDetails = ({
//   t, watched = false, data, activeTab, removeFromWatchList, addToWatchList,
// }) => {
export const DelegateDetails = () => {
  const {
    data, activeTab, watched = false, addToWatchList, removeFromWatchList, t,
  } = useContext(DelegateRowContext);
  const showEyeIcon = activeTab === 'active' || activeTab === 'standby' || activeTab === 'sanctioned' || activeTab === 'watched';
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
          <WalletVisual address={data.address} />
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

// export const RoundState = ({
//   activeTab, state, isBanned, t, time,
// }) => {
export const RoundState = () => {
  const {
    state, activeTab, isBanned, time, t,
  } = useContext(DelegateRowContext);
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

// const getDelegateStatus = (key, totalVotesReceived) => {
const getDelegateStatus = (key, grossVotesReceived) => {
  if (key === 'banned' || key === 'punished' || key === 'active') {
    return [key, delegateStatus[key]];
  }
  if (grossVotesReceived < DEFAULT_STANDBY_THRESHOLD) {
    return ['ineligible', delegateStatus.ineligible];
  }

  return [key, delegateStatus[key]];
};

// export const DelegateStatus = ({
//   activeTab, status, totalVotesReceived, theme,
// }) => {
export const DelegateStatus = () => {
  const {
    activeTab, status, totalVotesReceived, theme,
  } = useContext(DelegateRowContext);
  const [key, val] = getDelegateStatus(status, totalVotesReceived);

  return (
    <span className={getStatusClass(activeTab)}>
      <span className={`${styles.delegateStatus} ${styles[key]} ${styles[theme]}`}>{val}</span>
    </span>
  );
};

// export const ForgingTime = ({ activeTab, time, state }) => (
export const ForgingTime = () => {
  const { activeTab, state, time } = useContext(DelegateRowContext);
  return (
    <span className={getForgingTimeClass(activeTab)}>
      {state === 'missedBlock' ? '-' : time}
    </span>
  );
};
