import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import AccountVisual from '../../toolbox/accountVisual';
import tableStyles from '../../toolbox/table/table.css';
import LiskAmount from '../liskAmount';
import styles from './votesTab.css';
import { formatAmountBasedOnLocale } from '../../../utils/formattedNumber';

const VoteRow = ({
  data, onRowClick, t,
}) => (
  <div className={`${tableStyles.row} ${styles.row} vote-row`} onClick={() => onRowClick(data.address)}>
    <div className={`${grid['col-sm-1']} ${grid['col-lg-1']}`}>
      {(data.rank && +data.rank < 10 ? `0${data.rank}` : data.rank) || '-'}
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
    <div className={`${grid['col-sm-2']} ${grid['col-lg-2']}`}>
      {data.rewards
        ? (
          <span>
            <LiskAmount val={data.rewards} />
            {' '}
            {t('LSK')}
          </span>
        )
        : '-'}
    </div>
    <div className={`${grid['col-sm-2']} ${grid['col-lg-1']}`}>
      {data.productivity !== undefined
        ? `${formatAmountBasedOnLocale({ value: data.productivity })}%`
        : '-'
      }
    </div>
    <div className={`${grid['col-sm-4']} ${grid['col-lg-2']}`}>
      {data.vote
        ? (
          <span className={styles.votes}>
            <LiskAmount val={data.vote} />
            {' '}
            {t('LSK')}
          </span>
        )
        : '-'}
    </div>
  </div>
);

const areEqual = (prevProps, nextProps) =>
  (prevProps.data.address === nextProps.data.address);

export default React.memo(VoteRow, areEqual);
