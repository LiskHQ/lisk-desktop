import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import gridVisibility from 'flexboxgrid-helpers/dist/flexboxgrid-helpers.min.css';
import { DateTimeFromTimestamp } from '../../../../toolbox/timestamp';
import AccountVisualWithAddress from '../../../../shared/accountVisualWithAddress';
import DialogLink from '../../../../toolbox/dialog/link';
import VoteItem from '../../../../shared/voteItem';
import styles from '../delegates.css';

const VoteRow = ({
  data, className, delegates,
}) => {
  const { votes } = data.asset;
  return (
    <DialogLink
      className={`${grid.row} ${className} ${styles.voteRow} vote-row`}
      component="transactionDetails"
      data={{ transactionId: data.id, token: 'LSK' }}
    >
      <span className={grid['col-sm-4']}>
        <AccountVisualWithAddress
          address={data.senderId}
          transactionSubject="senderId"
          transactionType={3}
          showBookmarkedAddress
        />
      </span>
      <span className={grid['col-sm-3']}>
        <DateTimeFromTimestamp time={data.timestamp * 1000} token="BTC" />
      </span>
      <span className={`${grid['col-lg-1']} ${gridVisibility['hidden-md']}  ${gridVisibility['hidden-sm']} ${gridVisibility['hidden-xs']}`}>
        <span>{Math.ceil(data.height / 101)}</span>
      </span>
      <span className={`${grid['col-sm-5']} ${grid['col-lg-4']} ${styles.votesColumn}`}>
        {
            votes && votes.length ? (
              <span className={styles.vote}>
                <span className={styles.delegatesList}>
                  {votes.map(({ amount, delegateAddress }) => (
                    <VoteItem
                      key={`vote-${delegateAddress}`}
                      vote={{ confirmed: amount }}
                      address={delegateAddress}
                      title={delegates[delegateAddress] && delegates[delegateAddress].username}
                    />
                  ))}
                </span>
              </span>
            ) : null
          }
      </span>
    </DialogLink>
  );
};

/* istanbul ignore next */
const areEqual = (prevProps, nextProps) => (prevProps.data.id === nextProps.data.id);

export default React.memo(VoteRow, areEqual);
