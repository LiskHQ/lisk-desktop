import React from 'react';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import routes from '../../../../../constants/routes';
import Tooltip from '../../../../toolbox/tooltip/tooltip';
import Icon from '../../../../toolbox/icon';
import AccountVisual from '../../../../toolbox/accountVisual';
import { formatAmountBasedOnLocale } from '../../../../../utils/formattedNumber';
import styles from '../delegates.css';
import DelegateWeight from './delegateWeight';

const statuses = {
  forging: 'Forging',
  awaitingSlot: 'Awaiting slot',
  notForging: 'Not forging',
  missedBlock: 'Missed block',
};

const icons = {
  forging: 'delegateForged',
  awaitingSlot: 'delegateAwaiting',
  notForging: 'delegateAwaiting',
  missedBlock: 'delegateMissed',
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

const DelegateRow = ({
  data, className, t,
}) => {
  const formattedForgingTime = getForgingTime(data.forgingTime);
  return (
    <Link
      className={`${grid.row} ${className} delegate-row ${styles.tableRow}`}
      to={`${routes.account.path}?address=${data.address}`}
    >
      <span className={`${grid['col-xs-4']}`}>
        <div className={`${styles.delegateDetails}`}>
          <AccountVisual address={data.address} />
          <div>
            <p className={styles.delegateName}>
              {data.username}
            </p>
            <p className={styles.delegateAddress}>{data.address}</p>
          </div>
        </div>
      </span>
      <span className={`${grid['col-xs-2']}`}>
        {`${formatAmountBasedOnLocale({ value: data.productivity })} %`}
      </span>
      <span className={`${grid['col-xs-1']} ${styles.noEllipsis}`}>
        {`#${data.rank}`}
      </span>
      <span className={`${grid['col-xs-2']}`}>
        <DelegateWeight value={data.totalVotesReceived} />
      </span>
      <span className={`${grid['col-xs-2']} ${styles.noEllipsis}`}>
        {formattedForgingTime}
      </span>
      <span className={`${grid['col-xs-1']} ${styles.noEllipsis}`}>
        <div className={`${styles.statusIconsContainer}`}>
          <Tooltip
            title={data.forgingTime
              ? t(statuses[data.forgingTime.status])
              : t(statuses.notForging)}
            position="left"
            size="maxContent"
            content={(
              <Icon
                className={styles.statusIcon}
                name={data.forgingTime
                  ? t(icons[data.forgingTime.status])
                  : t(icons.notForging)}
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
          {(data.isBanned) && (
          <Tooltip
            position="left"
            size="maxContent"
            content={<Icon className={`${styles.statusIcon} ${styles.warningIcon}`} name="delegateWarning" />}
            footer={(
              <p>{formattedForgingTime}</p>
            )}
          >
            <p className={styles.statusToolip}>
              {t('This delegate will be punished in upcoming rounds')}
            </p>
          </Tooltip>
          )}
        </div>
      </span>
    </Link>
  );
};

export default React.memo(DelegateRow);
