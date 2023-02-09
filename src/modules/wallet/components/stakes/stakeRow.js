import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { tokenMap } from '@token/fungible/consts/tokens';
import { truncateAddress } from '@wallet/utils/account';
import WalletVisual from '@wallet/components/walletVisual';
import tableStyles from '@theme/table/table.css';
import TokenAmount from '@token/fungible/components/tokenAmount';
import DialogLink from '@theme/dialog/link';
import Spinner from '@theme/Spinner';
import Icon from '@theme/Icon';
import styles from './stakes.css';

const StakeRow = ({ data, onRowClick, accounts }) => {
  const onClick = () => onRowClick(data.address);
  const account = accounts[data.address];
  const truncatedAddress = truncateAddress(data.address);
  return (
    <div className={`${grid.row} ${tableStyles.row} ${styles.row}`}>
      <div className={`${grid['col-sm-12']} stake-row`}>
        {/* Account visual */}
        <div className={grid['col-sm-5']} onClick={onClick}>
          <div className={`${styles.info}`}>
            <WalletVisual className={`${styles.avatar}`} address={truncatedAddress} size={40} />
            <div className={styles.walletInfo}>
              <span className={`${styles.username} stake-username`}>{data.username}</span>
              <span className={`${styles.address} showOnLargeViewPort`}>{truncatedAddress}</span>
            </div>
          </div>
        </div>

        {/* Validator rank */}
        <div className={`${grid['col-sm-2']} ${styles.flexLeftAlign}`} onClick={onClick}>
          <span>{account?.pos.validator.rank}</span>
        </div>

        {/* Validator weight */}
        <div className={`${grid['col-sm-2']} ${styles.flexLeftAlign}`} onClick={onClick}>
          <span>
            <TokenAmount
              val={account?.pos.validator.totalStakeReceived ?? 0}
              token={tokenMap.LSK.key}
            />
          </span>
        </div>

        {/* Stake amount */}
        {account ? (
          <div className={`${grid['col-sm-2']} ${styles.flexRightAlign}`} onClick={onClick}>
            <span className={styles.stakes}>
              <TokenAmount
                val={data.amount}
                token={tokenMap.LSK.key}
                showInt
                className={styles.stakeAmount}
              />
            </span>
          </div>
        ) : null}

        {/* Edit button */}
        {data.pending ? (
          <Spinner />
        ) : (
          <div className={grid['col-sm-1']}>
            <DialogLink
              className={`${styles.editStakeLink} edit-stake`}
              component="editStake"
              data={{ address: data.address }}
            >
              <Icon name="edit" />
            </DialogLink>
          </div>
        )}
      </div>
    </div>
  );
};

/* istanbul ignore next */
const areEqual = (prevProps, nextProps) =>
  prevProps.data.address === nextProps.data.address &&
  prevProps.data.amount === nextProps.data.amount &&
  (!!prevProps.accounts[nextProps.data.address] || !nextProps.accounts[nextProps.data.address]);

export default React.memo(StakeRow, areEqual);
