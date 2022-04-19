import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { tokenMap } from '@token/configuration/tokens';
import { truncateAddress } from '@wallet/utilities/account';
import WalletVisual from '@wallet/detail/identity/walletVisual';
import tableStyles from '@basics/table/table.css';
import LiskAmount from '@shared/liskAmount';
import DialogLink from '@basics/dialog/link';
import Spinner from '@basics/spinner';
import Icon from '@basics/icon';
import styles from './votes.css';

const VoteRow = ({
  data, onRowClick, accounts,
}) => {
  const onClick = () => onRowClick(data.address);
  const account = accounts[data.address];
  const truncatedAddress = truncateAddress(data.address);
  return (
    <div className={`${grid.row} ${tableStyles.row} ${styles.row}`}>
      <div className={`${grid['col-sm-12']} vote-row`}>
        {/* Account visual */}
        <div className={grid['col-sm-5']} onClick={onClick}>
          <div className={`${styles.info}`}>
            <WalletVisual
              className={`${styles.avatar}`}
              address={truncatedAddress}
              size={40}
            />
            <div className={styles.walletInfo}>
              <span className={`${styles.username} vote-username`}>{data.username}</span>
              <span className={`${styles.address} showOnLargeViewPort`}>{truncatedAddress}</span>
            </div>
          </div>
        </div>

        {/* Delegate rank */}
        <div className={`${grid['col-sm-2']} ${styles.flexLeftAlign}`} onClick={onClick}>
          <span>{account?.dpos.delegate.rank}</span>
        </div>

        {/* Delegate weight */}
        <div className={`${grid['col-sm-2']} ${styles.flexLeftAlign}`} onClick={onClick}>
          <span>
            <LiskAmount
              val={account?.dpos.delegate.totalVotesReceived ?? 0}
              token={tokenMap.LSK.key}
            />
          </span>
        </div>

        {/* Vote amount */}
        {account ? (
          <div className={`${grid['col-sm-2']} ${styles.flexRightAlign}`} onClick={onClick}>
            <span className={styles.votes}>
              <LiskAmount
                val={data.amount}
                token={tokenMap.LSK.key}
                showInt
                className={styles.voteAmount}
              />
            </span>
          </div>
        ) : null}

        {/* Edit button */}
        {
        data.pending
          ? <Spinner />
          : (
            <div className={grid['col-sm-1']}>
              <DialogLink
                className={`${styles.editVoteLink} edit-vote`}
                component="editVote"
                data={{ address: data.address }}
              >
                <Icon name="edit" />
              </DialogLink>
            </div>
          )
      }
      </div>
    </div>
  );
};

/* istanbul ignore next */
const areEqual = (prevProps, nextProps) => (
  prevProps.data.address === nextProps.data.address
  && prevProps.data.amount === nextProps.data.amount
  && (!!prevProps.accounts[nextProps.data.address]
    || !nextProps.accounts[nextProps.data.address])
);

export default React.memo(VoteRow, areEqual);
