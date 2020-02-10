import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import AccountVisual from '../../toolbox/accountVisual';
import tableStyles from '../../toolbox/table/table.css';
import LiskAmount from '../liskAmount';
import styles from './votesTab.css';
import { formatAmountBasedOnLocale } from '../../../utils/formattedNumber';

const VoteRow = ({
  data, onRowClick, t, apiVersion,
}) => (
  <div className={`${tableStyles.row} ${styles.row} vote-row`} onClick={() => onRowClick(data.address)}>
    <div className={apiVersion === '3' ? 'hidden' : grid['col-sm-1']}>
      {
        /* istanbul ignore next */
        (data.rank && +data.rank < 10 ? `0${data.rank}` : data.rank) || '-'
      }
    </div>
    <div className={`${grid['col-sm-3']} ${grid['col-lg-6']}`}>
      <div className={`${styles.info}`}>
        <AccountVisual
          className={`${styles.avatar}`}
          address={data.address}
          size={36}
        />
        <div className={styles.accountInfo}>
          <span className={`${styles.title} vote-username`}>{data.username}</span>
          <span>{data.address}</span>
        </div>
      </div>
    </div>
    <div className={grid['col-sm-2']}>
      <span>
        <LiskAmount val={data.rewards} />
        {' '}
        {t('LSK')}
      </span>
    </div>
    <div className={`${grid['col-sm-2']} ${grid[apiVersion === '3' ? 'col-lg-2' : 'col-lg-1']}`}>
      {data.productivity !== undefined
        ? `${formatAmountBasedOnLocale({ value: data.productivity })}%`
        /* istanbul ignore next */
        : '-'
      }
    </div>
    <div className={`${grid['col-sm-4']} ${grid['col-lg-2']}`}>
      <span className={styles.votes}>
        <LiskAmount val={data.vote || data.voteWeight} token="LSK" />
      </span>
    </div>
  </div>
);

/* istanbul ignore next */
const areEqual = (prevProps, nextProps) =>
  (prevProps.data.address === nextProps.data.address
    && prevProps.data.rewards === nextProps.data.rewards);

export default React.memo(VoteRow, areEqual);
