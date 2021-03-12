/* eslint-disable no-nested-ternary */
import React from 'react';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import { useDispatch } from 'react-redux';
import routes from 'constants';
import { formatAmountBasedOnLocale } from 'utils/formattedNumber';
import regex from 'utils/regex';
import { addedToWatchList, removedFromWatchList } from 'actions';
import Tooltip from '../../../../toolbox/tooltip/tooltip';
import Icon from '../../../../toolbox/icon';
import AccountVisual from '../../../../toolbox/accountVisual';
import styles from '../delegates.css';
import DelegateWeight from './delegateWeight';

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
  'non-eligible': 'Non-eligible to forge',
};

const getForgingTime = (data) => {
  if (!data || data.time === -1) return '-';
  if (data.time === 0) return 'now';
  const { time, tense } = data;
  const minutes = time / 60 >= 1 ? `${Math.floor(time / 60)}m ` : '';
  const seconds = time % 60 >= 1 ? `${time % 60}s` : '';
  if (tense === 'future') {
    return `in ${minutes}${seconds}`;
  }
  return `${minutes}${seconds} ago`;
};

// eslint-disable-next-line complexity
const DelegateDetails = ({
  t, watched = false, data, activeTab, removeFromWatchList, addToWatchList,
}) => {
  const showEyeIcon = activeTab === 'active' || activeTab === 'standby' || activeTab === 'watched';
  return (
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
          <p className={`${styles.delegateAddress} showOnLargeViewPort`}>{data.address}</p>
          <p className={`${styles.delegateAddress} hideOnLargeViewPort`}>{data.address && data.address.replace(regex.lskAddressTrunk, '$1...$3')}</p>
        </div>
      </div>
    </div>
  );
};

const RoundStatus = ({ data, t, formattedForgingTime }) => (
  <>
    <Tooltip
      title={data.forgingTime
        ? t(roundStatus[data.forgingTime.status])
        : t(roundStatus.missedBlock)}
      position="left"
      size="maxContent"
      content={(
        <Icon
          className={styles.statusIcon}
          name={
            data.forgingTime
              ? icons[data.forgingTime.status]
              : icons.notForging
          }
        />
      )}
      footer={(
        <p>{formattedForgingTime}</p>
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
          <p>{formattedForgingTime}</p>
        )}
      >
        <p>
          {t('This delegate will be punished in upcoming rounds')}
        </p>
      </Tooltip>
    )}
  </>
);

const DelegateStatus = ({ activeTab, data }) => {
  const status = data.delegateWeight < 100000000000 ? 'non-eligible' : data.status;
  return (
    <span className={
      activeTab === 'watched'
        ? `${grid['col-xs-1']}`
        : activeTab === 'sanctioned' ? `${grid['col-xs-4']}`
          : activeTab !== 'active' ? `${grid['col-xs-3']}` : 'hidden'}
    >
      <span className={`${styles.delegateStatus} ${styles[status]}`}>{delegateStatus[status]}</span>
    </span>
  );
};

// eslint-disable-next-line complexity
const DelegateRow = ({
  data, className, t, activeTab, watchList, setActiveTab,
}) => {
  const formattedForgingTime = data.forgingTime && getForgingTime(data.forgingTime);
  const dispatch = useDispatch();

  const isWatched = watchList.find(address => address === data.address);

  const removeFromWatchList = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (watchList.length === 1) {
      setActiveTab('active');
    }
    dispatch(removedFromWatchList({ address: data.address }));
  };

  const addToWatchList = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addedToWatchList({ address: data.address }));
  };

  return (
    <Link
      className={`${className} delegate-row ${styles.tableRow}`}
      to={`${routes.account.path}?address=${data.address}`}
    >
      <span className={grid['col-xs-4']}>
        <DelegateDetails
          t={t}
          data={data}
          watched={isWatched}
          activeTab={activeTab}
          addToWatchList={addToWatchList}
          removeFromWatchList={removeFromWatchList}
        />
      </span>
      <span className={
        activeTab === 'active' || activeTab === 'watched'
          ? `${grid['col-xs-2']}`
          : activeTab === 'sanctioned' ? `${grid['col-xs-4']}`
            : `${grid['col-xs-3']}`}
      >
        {`${formatAmountBasedOnLocale({ value: data.productivity })} %`}
      </span>
      {/*
      <span
        className={activeTab !== 'sanctioned' ?
          (activeTab === 'watched' ? `${grid['col-xs-1']}` :
          `${grid['col-xs-2']}`) : `${grid['col-xs-3']} ${styles.noEllipsis}`}
      >
        {`#${data.rank}`}
      </span> */}
      {activeTab !== 'sanctioned' && (
        <span className={`${grid['col-xs-2']}`}>
          <DelegateWeight value={data.delegateWeight} />
        </span>
      )}
      {(activeTab === 'active' || activeTab === 'watched') && (
        <>
          <span className={`
            ${activeTab === 'active'
            ? `${grid['col-xs-3']}`
            : activeTab === 'watched' ? `${grid['col-xs-2']}`
              : 'hidden'}
            ${styles.noEllipsis}
            `}
          >
            {formattedForgingTime}
          </span>
          <span className={`${grid['col-xs-1']} ${styles.noEllipsis} ${styles.statusIconsContainer}`}>
            <RoundStatus data={data} t={t} formattedForgingTime={formattedForgingTime} />
          </span>
        </>
      )}
      {(activeTab === 'watched' || activeTab !== 'active') && <DelegateStatus data={data} activeTab={activeTab} />}
    </Link>
  );
};

export default React.memo(DelegateRow);
