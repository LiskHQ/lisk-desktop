/* istanbul ignore file */
import React, { useContext } from 'react';

import { formatAmountBasedOnLocale } from 'src/utils/formattedNumber';
import { fromRawLsk } from '@token/fungible/utils/lsk';
import { truncateAddress } from '@wallet/utils/account';
import WalletVisual from '@wallet/components/walletVisual';
import Tooltip from 'src/theme/Tooltip';
import Icon from 'src/theme/Icon';
import { useTheme } from 'src/theme/Theme';
import { DEFAULT_STANDBY_THRESHOLD } from '@pos/validator/consts';
import ValidatorRowContext from '../../context/validatorRowContext';
import styles from '../ValidatorsMonitorView/Validators.css';
import {
  getValidatorDetailsClass,
  getStatusClass,
  getValidatorWeightClass,
  getRoundStateClass,
  getForgingTimeClass,
  getValidatorRankClass,
} from './TableHeader';
import ValidatorSummary from '../ValidatorSummary/ValidatorSummary';

const roundStates = {
  forging: 'Forging',
  awaitingSlot: 'Awaiting slot',
  missedBlock: 'Missed slot',
};

const icons = {
  forging: 'validatorForged',
  awaitingSlot: 'validatorAwaiting',
  missedBlock: 'validatorMissed',
};

const validatorStatus = {
  active: 'Active',
  standby: 'Standby',
  banned: 'Banned',
  punished: 'Punished',
  ineligible: 'Ineligible',
};

const getValidatorStatus = (key, grossVotesReceived) => {
  if (key === 'banned' || key === 'punished' || key === 'active') {
    return [key, validatorStatus[key]];
  }
  if (grossVotesReceived < DEFAULT_STANDBY_THRESHOLD) {
    return ['ineligible', validatorStatus.ineligible];
  }

  return [key, validatorStatus[key]];
};

export const ValidatorRank = () => {
  const { data, activeTab } = useContext(ValidatorRowContext);
  return (
    <span className={getValidatorRankClass(activeTab)}>
      <span>#{data.rank}</span>
    </span>
  );
};

export const ValidatorWeight = () => {
  const {
    data: { voteWeight },
    activeTab,
  } = useContext(ValidatorRowContext);
  const formatted = formatAmountBasedOnLocale({
    value: fromRawLsk(voteWeight),
    format: '0a',
  });

  return (
    <span className={getValidatorWeightClass(activeTab)}>
      <span>{formatted}</span>
    </span>
  );
};

export const ValidatorDetails = () => {
  const {
    data,
    activeTab,
    watched = false,
    addToWatchList,
    removeFromWatchList,
    t,
  } = useContext(ValidatorRowContext);
  const theme = useTheme();
  const { status, totalVotesReceived, voteWeight } = data;
  const showEyeIcon =
    activeTab === 'active' ||
    activeTab === 'standby' ||
    activeTab === 'sanctioned' ||
    activeTab === 'watched';
  const [key, val] = getValidatorStatus(status, totalVotesReceived);
  const formattedVoteWeight = formatAmountBasedOnLocale({
    value: fromRawLsk(voteWeight),
    format: '0a',
  });

  return (
    <span className={getValidatorDetailsClass(activeTab)}>
      <div className={styles.validatorColumn}>
        <Tooltip
          tooltipClassName={styles.tooltipContainer}
          className={styles.eyeIconTooltip}
          position="bottom right"
          size="maxContent"
          indent
          content={
            <span
              className={`
                ${styles.eyeIcon} ${!showEyeIcon ? 'hidden' : ''} ${
                watched && showEyeIcon ? styles.watchedValidator : ''
              } watch-icon
              `}
              onClick={watched ? removeFromWatchList : addToWatchList}
            >
              <Icon name={watched ? 'eyeActive' : 'eyeInactive'} />
            </span>
          }
        >
          <p className={styles.watchedTooltip}>
            {watched ? t('Remove from watched') : t('Add to watched')}
          </p>
        </Tooltip>
        <div className={`${styles.validatorDetails}`}>
          <Tooltip
            noArrow
            tooltipClassName={styles.summaryTooltipContainer}
            className={styles.summaryTooltip}
            position="center right"
            size="maxContent"
            content={<WalletVisual address={data.address} />}
          >
            <ValidatorSummary
              delegate={data}
              weight={formattedVoteWeight}
              status={{
                value: val,
                className: `${styles.validatorStatus} ${styles[key]} ${styles[theme]}`,
              }}
            />
          </Tooltip>
          <div>
            <p className={styles.validatorName}>{data.name}</p>
            <p className={styles.validatorAddress}>{truncateAddress(data.address)}</p>
          </div>
        </div>
      </div>
    </span>
  );
};

export const RoundState = () => {
  const {
    data: { state, isBanned },
    activeTab,
    time,
    t,
  } = useContext(ValidatorRowContext);
  if (state === undefined) {
    return (
      <span
        className={`${getRoundStateClass(activeTab)} ${styles.noEllipsis} ${
          styles.statusIconsContainer
        }`}
      >
        -
      </span>
    );
  }

  return (
    <span
      className={`${getRoundStateClass(activeTab)} ${styles.noEllipsis} ${
        styles.statusIconsContainer
      }`}
    >
      <Tooltip
        title={t('Round state:')}
        position="left"
        size="maxContent"
        content={<Icon className={styles.statusIcon} name={icons[state]} />}
      >
        <p className={styles.statusToolip}>{roundStates[state]}</p>
      </Tooltip>
      {isBanned && (
        <Tooltip
          position="left"
          size="maxContent"
          content={<Icon className={styles.statusIcon} name="delegateWarning" />}
          footer={<p>{time}</p>}
        >
          <p>{t('This validator will be punished in upcoming rounds')}</p>
        </Tooltip>
      )}
    </span>
  );
};

export const ValidatorStatus = () => {
  const {
    activeTab,
    data: { status, totalVotesReceived },
  } = useContext(ValidatorRowContext);
  const theme = useTheme();
  const [key, val] = getValidatorStatus(status, totalVotesReceived);

  return (
    <span className={getStatusClass(activeTab)}>
      <span className={`${styles.validatorStatus} ${styles[key]} ${styles[theme]}`}>{val}</span>
    </span>
  );
};

export const ForgingTime = () => {
  const {
    activeTab,
    data: { state },
    time,
  } = useContext(ValidatorRowContext);
  return (
    <span className={getForgingTimeClass(activeTab)}>{state === 'missedBlock' ? '-' : time}</span>
  );
};
