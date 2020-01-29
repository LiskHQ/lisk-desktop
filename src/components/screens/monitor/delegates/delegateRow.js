import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import routes from '../../../../constants/routes';
import Tooltip from '../../../toolbox/tooltip/tooltip';
import AccountVisualWithAddress from '../../../shared/accountVisualWithAddress';
import { formatAmountBasedOnLocale } from '../../../../utils/formattedNumber';
import styles from './delegates.css';

const statuses = {
  forging: 'Forging',
  awaitingSlot: 'Awaiting slot',
  notForging: 'Not forging',
  missedBlock: 'Missed block',
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
  data, className, forgingTimes, t,
}) => {
  const forgingTime = forgingTimes[data.publicKey];
  const formattedForgingTime = getForgingTime(forgingTime);
  return (
    <Link
      className={`${grid.row} ${className} delegate-row`}
      to={`${routes.accounts.path}/${data.address}`}
    >
      <span className={grid['col-md-1']}>
        {`#${data.rank}`}
      </span>
      <span className={grid['col-md-2']}>
        {data.username}
      </span>
      <span className={data.rank > 101 ? `${grid['col-xs-5']} ${grid['col-md-6']}` : grid['col-md-3']}>
        <AccountVisualWithAddress address={data.address} />
      </span>
      {
        data.rank <= 101 ? (
          <Fragment>
            <span className={grid['col-md-2']}>
              {formattedForgingTime}
            </span>
            <span className={`${grid['col-xs-2']} ${grid['col-md-1']}`}>
              <Tooltip
                title={forgingTime
                  ? t(statuses[forgingTime.status])
                  : t(statuses.notForging)}
                className="showOnBottom"
                size="s"
                content={(
                  <div className={`${styles.status} ${
                    styles[forgingTime
                      ? forgingTime.status
                      : 'notForging']}`
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
            </span>
          </Fragment>
        ) : null
      }
      <span className={`${grid['col-xs-2']} ${grid['col-md-2']} ${grid['col-lg-2']}`}>
        {`${formatAmountBasedOnLocale({ value: data.productivity })} %`}
      </span>
      <span className={`${grid['col-xs-2']} ${grid['col-md-1']}`}>
        {data.productivity}
      </span>
    </Link>
  );
};

export default React.memo(DelegateRow);
