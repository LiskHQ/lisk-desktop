import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { getTransactionValue } from '@transaction/utils/transaction';
import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import DateTimeFromTimestamp from 'src/modules/common/components/timestamp';
import WalletVisual from '@wallet/components/walletVisual';
import { joinModuleAndCommand } from '@transaction/utils/moduleCommand';
import Icon from 'src/theme/Icon';
import Tooltip from 'src/theme/Tooltip';
import { ROUND_LENGTH } from '@pos/validator/consts';
import TokenAmount from '@token/fungible/components/tokenAmount';
import WalletVisualWithAddress from '@wallet/components/walletVisualWithAddress';
import {
  truncateAddress,
  truncateTransactionID,
  extractAddressFromPublicKey,
} from '@wallet/utils/account';
import { useCurrentApplication } from '@blockchainApplication/manage/hooks';
import { useNetworkSupportedTokens } from '@token/fungible/hooks/queries';
import Spinner from 'src/theme/Spinner';
import routes from 'src/routes/routes';
import { getModuleCommandTitle } from '@transaction/utils';
import { getValidatorDetailsClass } from '@pos/validator/components/ValidatorsTable/TableHeader';
import styles from './row.css';
import TransactionRowContext from '../../context/transactionRowContext';
import TransactionTypeFigure from '../TransactionTypeFigure';

export const ID = ({ isWallet }) => {
  const { data, address } = useContext(TransactionRowContext);
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

export const Height = ({ t }) => {
  const { data } = useContext(TransactionRowContext);

  const isPending = data.executionStatus === 'pending';
  if (isPending || !data.block?.height) {
    return <Spinner completed={isPending || data.block?.isFinal} label={t('Pending...')} />;
  }

  return <span>{data.block?.height || '-'}</span>;
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

export const ValidatorDetails = ({ isWallet }) => {
  const { data, activeTab, address } = useContext(TransactionRowContext);

  return (
    <span className={getValidatorDetailsClass(activeTab)}>
      <div className={styles.validatorColumn}>
        <div className={`${styles.validatorDetails}`}>
          {isWallet && (
            <Icon
              name={
                data.sender.address === address ? 'sentTransactionIcon' : 'receivedTransactionIcon'
              }
            />
          )}
          <WalletVisual address={data.sender.address} />
          <div>
            <p className={styles.validatorName}>{data.sender.name}</p>
            <p className={styles.validatorAddress}>{truncateAddress(data.sender.address)}</p>
          </div>
        </div>
      </div>
    </span>
  );
};

export const Sender = ({ isWallet }) => <ValidatorDetails isWallet={isWallet} />;

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
    return <TransactionTypeFigure moduleCommand={moduleCommand} address={address} />;
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
  const isPending = data.executionStatus === 'pending';

  if (isPending || !data.block?.timestamp) {
    return <Spinner completed={isPending || data.block?.isFinal} label={t('Pending...')} />;
  }

  return (
    <DateTimeFromTimestamp
      className={styles.dateTimeProp}
      tableDateFormat
      time={data.block.timestamp}
    />
  );
};

export const Amount = () => {
  const { data, token } = useContext(TransactionRowContext);
  const [currentApplication] = useCurrentApplication();
  const { data: appsMetaTokens } = useNetworkSupportedTokens(currentApplication);
  return <span className={styles.amount}>{getTransactionValue(data, token, appsMetaTokens)}</span>;
};

export const Fee = ({ t }) => {
  const { data, token } = useContext(TransactionRowContext);

  return (
    <span className={styles.transactionFeeCell}>
      <Tooltip
        title={t('Transaction')}
        position="bottom"
        tooltipClassName={`${styles.tooltip} ${styles.tooltipOffset}`}
        content={<TokenAmount val={data.fee} token={token} />}
        size="s"
      >
        <p>{getModuleCommandTitle(t)[data.moduleCommand]}</p>
      </Tooltip>
    </span>
  );
};

export const Status = ({ t }) => {
  const { data } = useContext(TransactionRowContext);
  const transactionStatus =
    data.executionStatus.charAt(0).toUpperCase() + data.executionStatus.slice(1);
  const transactionStatusIcon = `transactionStatus${transactionStatus}`;

  return (
    <span>
      <Tooltip
        title={t(transactionStatus)}
        position="left"
        tooltipClassName={`${styles.tooltip} ${styles.tooltipOffset}`}
        content={<Icon name={transactionStatusIcon} />}
        size="s"
      />
    </span>
  );
};

const generateStakes = (params, validators, token, t) => {
  const stakeElements = params.stakes.slice(0, 1).map((stake) => (
    <span
      className={`${styles.container} stake-item-address`}
      key={`stake-${stake.validatorAddress}`}
    >
      <Link to={`${routes.wallet.path}?address=${stake.validatorAddress}`}>
        <span className={styles.primaryText}>
          {validators[stake.validatorAddress]?.name ?? truncateAddress(stake.validatorAddress)}
        </span>
      </Link>
      {'— '}
      <span className={`${styles.value}`}>
        <TokenAmount val={stake.amount} token={token} />
      </span>
    </span>
  ));

  return (
    <div className={styles.stakeDetails}>
      {stakeElements}
      {params.stakes.length > 1 && (
        <span className={styles.more}>{`${params.stakes.length - 1} ${t('more')}...`}</span>
      )}
    </div>
  );
};

export const Params = ({ t }) => {
  const { data, validators = [], activeToken } = useContext(TransactionRowContext);
  const { stake, registerValidator, transfer } = MODULE_COMMANDS_NAME_MAP;

  const getDetails = () => {
    switch (data.moduleCommand) {
      case registerValidator:
        return data.params.validator?.username;
      case stake:
        return generateStakes(data.params, validators, activeToken, t);
      case transfer:
        return data.params.data;
      default:
        return '-';
    }
  };

  return <span className="transaction-reference">{getDetails()}</span>;
};
