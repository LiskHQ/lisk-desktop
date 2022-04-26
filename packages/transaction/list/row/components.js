import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { tokenMap } from '@token/configuration/tokens';
import { getModuleAssetTitle } from '@transaction/utilities/moduleAssets';
import { getTxAmount } from '@transaction/utilities/transaction';
import { MODULE_ASSETS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import DateTimeFromTimestamp from '@basics/timestamp';
import Icon from '@basics/icon';
import Tooltip from '@basics/tooltip/tooltip';
import LiskAmount from '@shared/liskAmount';
import TransactionTypeFigure from '@transaction/detail/info/transactionTypeFigure';
import TransactionAmount from '@transaction/detail/info/transactionAmount';
import WalletVisualWithAddress from '@wallet/detail/identity/walletVisual/walletVisualWithAddress';
import { truncateAddress } from '@wallet/utilities/account';
import routes from '@screens/router/routes';
import styles from './row.css';
import { Context } from './index';

// @todo read the round size from the length of forgers
const roundSize = 103;

export const Sender = () => {
  const { data, avatarSize } = useContext(Context);
  return (
    <WalletVisualWithAddress
      className="transaction-row-sender"
      address={data.sender.address}
      transactionSubject="sender"
      moduleAssetId={data.moduleAssetId}
      showBookmarkedAddress
      size={avatarSize}
    />
  );
};

export const Recipient = () => {
  const { data, avatarSize } = useContext(Context);
  return (
    <WalletVisualWithAddress
      className="transaction-row-recipient"
      address={data.asset.recipient?.address}
      transactionSubject="recipient"
      moduleAssetId={data.moduleAssetId}
      showBookmarkedAddress
      size={avatarSize}
    />
  );
};

export const Counterpart = () => {
  const { data, host, avatarSize } = useContext(Context);

  // Show tx icon
  if (data.moduleAssetId !== MODULE_ASSETS_NAME_ID_MAP.transfer && host) {
    return (<TransactionTypeFigure moduleAssetId={data.moduleAssetId} address={data.sender.address} />);
  }
  // Show recipient
  if (data.asset.recipient?.address !== host) {
    return (
      <WalletVisualWithAddress
        className="transaction-row-recipient"
        address={data.asset.recipient?.address}
        transactionSubject="recipient"
        moduleAssetId={data.moduleAssetId}
        showBookmarkedAddress
        size={avatarSize}
      />
    );
  }
  // Show sender
  return (
    <WalletVisualWithAddress
      className="transaction-row-sender"
      address={data.sender.address}
      transactionSubject="sender"
      moduleAssetId={data.moduleAssetId}
      showBookmarkedAddress
      size={avatarSize}
    />
  );
};

export const Date = ({ t }) => {
  const { data } = useContext(Context);

  if (data.isPending || !data.block.timestamp) {
    return (<Spinner completed={!data.isPending || data.block.timestamp} label={t('Pending...')} />);
  }

  // @todo remove hard coded token
  return (
    <DateTimeFromTimestamp time={data.block.timestamp * 1000} token={tokenMap.BTC.key} />
  );
};

export const Amount = () => {
  const { data, layout, activeToken, host } = useContext(Context);
  if (layout !== 'full') {
    return (
      <span>
        <TransactionAmount
          host={host}
          token={activeToken}
          showRounded
          recipient={data.asset.recipient?.address}
          moduleAssetId={data.moduleAssetId}
          amount={getTxAmount(data)}
        />
      </span>
    );
  }
  return (
    <span className={styles.amount}>
      <LiskAmount
        val={getTxAmount(data)}
        token={activeToken}
      />
      <span className={`${styles.fee} hideOnLargeViewPort`}>
        <LiskAmount val={data.fee} token={activeToken} />
      </span>
    </span>
  );
};

export const Fee = ({ t }) => {
  const { data, activeToken } = useContext(Context);

  return (
    <span className={styles.transactionFeeCell}>
      <Tooltip
        title={t('Transaction')}
        position="bottom"
        tooltipClassName={`${styles.tooltip} ${styles.tooltipOffset}`}
        content={<LiskAmount val={data.fee} token={activeToken} />}
        size="s"
      >
        <p>{getModuleAssetTitle(t)[data.moduleAssetId]}</p>
      </Tooltip>
    </span>
  );
};

export const Status = ({ t }) => {
  const { data, currentBlockHeight } = useContext(Context);

  return (
    <span>
      <Tooltip
        title={data.isPending ? t('Pending') : t('Confirmed')}
        position="left"
        tooltipClassName={`${styles.tooltip} ${styles.tooltipOffset}`}
        content={<Icon name={data.isPending ? 'pending' : 'approved'} />}
        size="s"
      >
        <p>{`${currentBlockHeight ? currentBlockHeight - data.block.height : 0}/${roundSize} ${t('Confirmations')}`}</p>
      </Tooltip>
    </span>
  );
};

const generateVotes = (asset, delegates, token, t) => {
  const voteElements = asset.votes.slice(0, 1).map(vote => (
    <span
      className={`${styles.container} vote-item-address`}
      key={`vote-${vote.delegateAddress}`}
    >
      <Link
        to={`${routes.wallet.path}?address=${vote.delegateAddress}`}
      >
        <span className={styles.primaryText}>
          {delegates[vote.delegateAddress] || truncateAddress(vote.delegateAddress)}
        </span>
      </Link>
      <span className={`${styles.value} vote-item-value`}>
        <LiskAmount val={vote.amount} token={token} />
      </span>
    </span>
  ));

  return (
    <div className={styles.voteDetails}>
      { voteElements }
      {
        asset.votes.length > 1 && (
          <span className={styles.more}>{`${asset.votes.length - 1} ${t('more')}...`}</span>
        )
      }
    </div>
  );
};

export const Assets = ({ t }) => {
  const { data, delegates = [], activeToken } = useContext(Context);
  const { voteDelegate, registerDelegate, transfer } = MODULE_ASSETS_NAME_ID_MAP;

  const getDetails = () => {
    switch (data.moduleAssetId) {
      case registerDelegate:
        return data.asset.delegate?.username;
      case voteDelegate:
        return generateVotes(data.asset, delegates, activeToken, t);
      case transfer:
        return data.asset.data;
      default:
        return '-';
    }
  };

  return (
    <span className="transaction-reference">{getDetails()}</span>
  );
};
