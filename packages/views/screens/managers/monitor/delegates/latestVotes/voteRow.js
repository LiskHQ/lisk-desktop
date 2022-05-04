import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import gridVisibility from 'flexboxgrid-helpers/dist/flexboxgrid-helpers.min.css';

import DateTimeFromTimestamp from 'src/modules/common/components/timestamp';
import WalletVisualWithAddress from '@wallet/components/walletVisualWithAddress';
import DialogLink from 'src/theme/dialog/link';
import VoteDetails from '@transaction/components/VoteItem';
import styles from '../delegates.css';

const VotesItemsList = ({ votes = [], delegates }) => {
  const [showAll, setShowAll] = useState(false);
  const { t } = useTranslation();
  return (
    <>
      {votes.length > 0 && (
        <span className={styles.vote}>
          <span className={styles.delegatesList}>
            {votes
              .slice(0, showAll ? votes.length : 2)
              .map(({ amount, delegateAddress }) => (
                <VoteDetails
                  key={`vote-${delegateAddress}`}
                  vote={{ confirmed: amount }}
                  address={delegateAddress}
                  title={
                    delegates[delegateAddress]
                    && delegates[delegateAddress].username
                  }
                  truncate
                />
              ))}
          </span>
          {!showAll && votes.length > 2 && (
            <button
              className={`${styles.loadMoreVotesBtn}`}
              onClick={(evt) => {
                evt.preventDefault();
                evt.stopPropagation();
                setShowAll(true);
              }}
            >
              {t('{{restVotes}} more...', { restVotes: votes.length - 2 })}
            </button>
          )}
        </span>
      )}
    </>
  );
};

const VoteRow = ({ data, className, delegates }) => {
  const { votes } = data.asset;
  return (
    <DialogLink
      className={`${grid.row} ${className} ${styles.tableRow} vote-row`}
      component="transactionDetails"
      data={{ transactionId: data.id, token: 'LSK' }}
    >
      <span className={grid['col-xs-4']}>
        <WalletVisualWithAddress
          address={data.sender.address}
          transactionSubject="senderId"
          transactionType={3}
          showBookmarkedAddress
        />
      </span>
      <span className={grid['col-xs-3']}>
        <DateTimeFromTimestamp time={data.block.timestamp * 1000} token="BTC" />
      </span>
      <span
        className={`${grid['col-lg-2']} ${gridVisibility['hidden-md']}  ${gridVisibility['hidden-sm']} ${gridVisibility['hidden-xs']}`}
      >
        <span>{Math.ceil(data.height / 101)}</span>
      </span>
      <span
        className={`${grid['col-xs-5']} ${grid['col-lg-3']} ${styles.votesColumn}`}
      >
        <VotesItemsList votes={votes} delegates={delegates} />
      </span>
    </DialogLink>
  );
};

/* istanbul ignore next */
const areEqual = (prevProps, nextProps) =>
  prevProps.data.id === nextProps.data.id;

export default React.memo(VoteRow, areEqual);
