import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { getTxAmount } from '@transaction/utils/transaction';
import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import DateTimeFromTimestamp from 'src/modules/common/components/timestamp';
import WalletVisual from '@wallet/components/walletVisual';
import { joinModuleAndCommand } from '@transaction/utils/moduleCommand';
import Icon from 'src/theme/Icon';
import Tooltip from 'src/theme/Tooltip';
import { ROUND_LENGTH } from '@dpos/validator/consts';
import TokenAmount from '@token/fungible/components/tokenAmount';
import WalletVisualWithAddress from '@wallet/components/walletVisualWithAddress';
import { truncateAddress, truncateTransactionID, extractAddressFromPublicKey } from '@wallet/utils/account';
import Spinner from 'src/theme/Spinner';
import routes from 'src/routes/routes';
import { getModuleCommandTitle } from '@transaction/utils';
import { getDelegateDetailsClass } from '@dpos/validator/components/DelegatesTable/tableHeader';
import styles from './row.css';
import TransactionRowContext from '../../context/transactionRowContext';
import TransactionTypeFigure from '../TransactionTypeFigure';
import TransactionAmount from '../TransactionAmount';

export const ID = ({ address, isWallet }) => {
  const { data } = useContext(TransactionRowContext);
  return (
    <span className={styles.txId}>
      {isWallet && (
        <Icon
          name={data.sender.address === address ? 'sentTransactionIcon' : 'receivedTransactionIcon'}
        />
      )}
      {truncateTransactionID(data.id)}
    </span>
  );
};

export const Height = () => {
  const { data } = useContext(TransactionRowContext);
  return <span>{data.block.height}</span>;
};

export const Round = () => {
  const { data } = useContext(TransactionRowContext);
  return <span>{Math.ceil(data.block.height / ROUND_LENGTH)}</span>;
};

export const Type = () => {
  const { data } = useContext(TransactionRowContext);
  const formatTransactionType = (txType) => txType.replace(':', ' ');
  return <span className={styles.type}>{formatTransactionType(data.moduleCommand)}</span>;
};

export const DelegateDetails = () => {
  const { data, activeTab } = useContext(TransactionRowContext);

  return (
    <span className={getDelegateDetailsClass(activeTab)}>
      <div className={styles.delegateColumn}>
        <div className={`${styles.delegateDetails}`}>
          <WalletVisual address={data.sender.address} />
          <div>
            <p className={styles.delegateName}>{data.sender.name}</p>
            <p className={styles.delegateAddress}>{truncateAddress(data.sender.address)}</p>
          </div>
        </div>
      </div>
    </span>
  );
};

export const Sender = () => <DelegateDetails />;

export const Recipient = () => {
  const { data, avatarSize } = useContext(TransactionRowContext);
  return (
    <WalletVisualWithAddress
      className="transaction-row-recipient"
      address={data.params.recipient?.address}
      transactionSubject="recipient"
      moduleCommand={data.moduleCommand}
      showBookmarkedAddress
      size={avatarSize}
    />
  );
};

export const Counterpart = () => {
  const { data, host, avatarSize } = useContext(TransactionRowContext);
  const moduleCommand = data.moduleCommand ?? joinModuleAndCommand(data);
  const address = extractAddressFromPublicKey(data.senderPublicKey || data.sender.publicKey);
  
  // Show tx icon
  if (moduleCommand !== MODULE_COMMANDS_NAME_MAP.transfer && host) {
    return (
      <TransactionTypeFigure moduleCommand={moduleCommand} address={address} />
    );
  }
  // Show recipient
  if (data.params.recipientAddress !== host) {
    return (
      <WalletVisualWithAddress
        className="transaction-row-recipient"
        address={data.params.recipientAddress}
        transactionSubject="recipient"
        moduleCommand={data.moduleCommand}
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
      moduleCommand={data.moduleCommand}
      showBookmarkedAddress
      size={avatarSize}
    />
  );
};

export const Date = ({ t }) => {
  const { data } = useContext(TransactionRowContext);

  if (data.isPending || !data.block.timestamp) {
    return <Spinner completed={!data.isPending || data.block?.timestamp} label={t('Pending...')} />;
  }

  return (
    <div className={styles.dateTime}>
      <DateTimeFromTimestamp time={data.block.timestamp} />
      <DateTimeFromTimestamp onlyTime time={data.block.timestamp} />
    </div>
  );
};

export const Amount = () => {
  const { data, layout, activeToken, host } = useContext(TransactionRowContext);

  if (layout !== 'full') {
    return (
      <span>
        <TransactionAmount
          host={host}
          token={activeToken}
          showRounded
          recipient={data.params.recipientAddress}
          moduleCommand={data.moduleCommand}
          amount={getTxAmount(data)}
        />
      </span>
    );
  }
  return (
    <span className={styles.amount}>
      <TokenAmount val={getTxAmount(data)} token={activeToken} />
      <span className={`${styles.fee} hideOnLargeViewPort`}>
        <TokenAmount val={data.fee} token={activeToken} />
      </span>
    </span>
  );
};

export const Fee = ({ t }) => {
  const { data, activeToken } = useContext(TransactionRowContext);

  return (
    <span className={styles.transactionFeeCell}>
      <Tooltip
        title={t('Transaction')}
        position="bottom"
        tooltipClassName={`${styles.tooltip} ${styles.tooltipOffset}`}
        content={<TokenAmount val={data.fee} token={activeToken} />}
        size="s"
      >
        <p>{getModuleCommandTitle(t)[data.moduleCommand]}</p>
      </Tooltip>
    </span>
  );
};

export const Status = ({ t }) => {
  const { data, currentBlockHeight } = useContext(TransactionRowContext);
  const roundSize = 103;
  const height = currentBlockHeight ? currentBlockHeight - data.block.height : 0;

  return (
    <span>
      <Tooltip
        title={data.isPending ? t('Pending') : t('Confirmed')}
        position="left"
        tooltipClassName={`${styles.tooltip} ${styles.tooltipOffset}`}
        content={<Icon name={data.isPending ? 'pending' : 'approved'} />}
        size="s"
      >
        <p>{`${height}/${roundSize} ${t('Confirmations')}`}</p>
      </Tooltip>
    </span>
  );
};

const generateVotes = (params, delegates, token, t) => {
  const voteElements = params.votes.slice(0, 1).map((vote) => (
    <span className={`${styles.container} vote-item-address`} key={`vote-${vote.delegateAddress}`}>
      <Link to={`${routes.wallet.path}?address=${vote.delegateAddress}`}>
        <span className={styles.primaryText}>
          {delegates[vote.delegateAddress]?.name ?? truncateAddress(vote.delegateAddress)}
        </span>
      </Link>
      <span className={`${styles.value} vote-item-value`}>
        <TokenAmount val={vote.amount} token={token} />
      </span>
    </span>
  ));

  return (
    <div className={styles.voteDetails}>
      {voteElements}
      {params.votes.length > 1 && (
        <span className={styles.more}>{`${params.votes.length - 1} ${t('more')}...`}</span>
      )}
    </div>
  );
};

export const Params = ({ t }) => {
  const { data, delegates = [], activeToken } = useContext(TransactionRowContext);
  const { voteDelegate, registerDelegate, transfer } = MODULE_COMMANDS_NAME_MAP;

  const getDetails = () => {
    switch (data.moduleCommand) {
      case registerDelegate:
        return data.params.delegate?.username;
      case voteDelegate:
        return generateVotes(data.params, delegates, activeToken, t);
      case transfer:
        return data.params.data;
      default:
        return '-';
    }
  };

  return <span className="transaction-reference">{getDetails()}</span>;
};
