/* eslint-disable max-lines */
import React, { useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { selectCurrentBlockHeight } from '@store/selectors';
import { getModuleAssetTitle, getModuleAssetSenderLabel } from '@utils/moduleAssets';
import { getTxAmount } from '@utils/transaction';
import { tokenMap, MODULE_ASSETS_NAME_ID_MAP } from '@constants';
import CopyToClipboard from '@toolbox/copyToClipboard';
import TransactionTypeFigure from '@shared/transactionTypeFigure';
import { DateTimeFromTimestamp } from '@toolbox/timestamp';
import DiscreetMode from '@shared/discreetMode';
import LiskAmount from '@shared/liskAmount';
import MultiSignatureMembers, { SignedAndRemainingMembers } from '@shared/multisignatureMembers';
import Tooltip from '@toolbox/tooltip/tooltip';
import { extractAddressFromPublicKey, truncateAddress, calculateRemainingAndSignedMembers } from '@utils/account';

import { Context } from '../transactionDetails';
import AccountInfo from './accountInfo';
import styles from './styles.css';

const getDelegateName = (transaction, activeToken) => (
  (activeToken === 'LSK'
  && transaction.asset
  && transaction.asset.username)
    ? transaction.asset.username : null
);

const getTxAsset = (tx) => {
  if (tx.asset?.data && tx.asset.data.length) {
    return tx.asset.data;
  }
  return '-';
};

const ValueAndLabel = ({ label, className, children }) => (
  <div className={`${styles.value} ${className}`}>
    <span className={styles.label}>
      {label}
    </span>
    {children}
  </div>
);

export const Illustration = () => {
  const { transaction: { sender, moduleAssetId } } = useContext(Context);
  const title = getModuleAssetTitle()[moduleAssetId];

  return (
    <div className={styles.illustration}>
      <TransactionTypeFigure
        address={sender.address}
        moduleAssetId={moduleAssetId}
        iconOnly
      />
      <h2 className="tx-header">{title}</h2>
    </div>
  );
};

export const Sender = () => {
  const {
    activeToken, transaction, network,
  } = useContext(Context);
  const delegateName = getDelegateName(transaction, activeToken);
  const senderLabel = getModuleAssetSenderLabel()[transaction.moduleAssetId];

  return (
    <AccountInfo
      className={`${styles.value} ${styles.sender}`}
      name={delegateName}
      token={activeToken}
      network={network}
      address={transaction.sender.address}
      addressClass="sender-address"
      label={senderLabel}
    />
  );
};

export const Recipient = ({ t }) => {
  const {
    activeToken, network, transaction,
  } = useContext(Context);

  return (
    <AccountInfo
      className={`${styles.value} ${styles.recipient}`}
      token={activeToken}
      network={network}
      address={transaction.asset.recipient.address}
      addressClass="receiver-address"
      label={t('Recipient')}
    />
  );
};

export const TransactionId = ({ t }) => {
  const {
    transaction: { id },
  } = useContext(Context);

  return (
    <ValueAndLabel label={t('Transaction ID')} className={styles.transactionId}>
      <span className="transaction-id">
        <CopyToClipboard
          text={truncateAddress(id)}
          value={id}
          className="tx-id"
          containerProps={{
            size: 'xs',
            className: 'copy-title',
          }}
          copyClassName={styles.copyIcon}
        />
      </span>
    </ValueAndLabel>
  );
};

export const Message = ({ t }) => {
  const {
    transaction,
  } = useContext(Context);

  return (
    <ValueAndLabel label={t('Message')} className={styles.message}>
      <div className="tx-reference">
        {getTxAsset(transaction)}
      </div>
    </ValueAndLabel>
  );
};

export const Amount = ({
  t,
}) => {
  const {
    activeToken, transaction,
  } = useContext(Context);
  const addresses = [transaction.asset.recipient?.address ?? '', transaction.sender.address];

  return (
    <ValueAndLabel label={t('Amount of transaction')} className={styles.amount}>
      <DiscreetMode addresses={addresses} shouldEvaluateForOtherAccounts>
        <span className="tx-amount">
          <LiskAmount val={getTxAmount(transaction)} />
          {' '}
          {activeToken}
        </span>
      </DiscreetMode>
    </ValueAndLabel>
  );
};

export const Date = ({ t }) => {
  const {
    activeToken, transaction,
  } = useContext(Context);

  return transaction.block?.timestamp ? (
    <ValueAndLabel label={t('Date')} className={styles.date}>
      <span className={`${styles.date} tx-date`}>
        <DateTimeFromTimestamp
          fulltime
          className="date"
          time={transaction.block.timestamp}
          token={activeToken}
          showSeconds
        />
      </span>
    </ValueAndLabel>
  )
    : <span>-</span>;
};

export const Fee = ({ t }) => {
  const {
    activeToken, transaction: { fee },
  } = useContext(Context);

  return (
    <ValueAndLabel label={t('Transaction fee')} className={styles.fee}>
      <span className="tx-fee">
        <LiskAmount val={fee} token={activeToken} />
      </span>
    </ValueAndLabel>
  );
};

export const Confirmations = ({ t }) => {
  const currentBlockHeight = useSelector(selectCurrentBlockHeight);
  const {
    activeToken, transaction,
  } = useContext(Context);

  const confirmations = activeToken === tokenMap.LSK.key
    ? (currentBlockHeight - transaction.height)
    : transaction.confirmations;

  return (
    <ValueAndLabel
      className={styles.confirmations}
      label={(
        <>
          {t('Confirmations')}
          <Tooltip position="top">
            <p>
              { t('Confirmations refer to the number of blocks added to the {{token}} blockchain after a transaction has been submitted. The more confirmations registered, the more secure the transaction becomes.',
                { token: tokenMap[activeToken].label })}
            </p>
          </Tooltip>
        </>
    )}
    >
      <span className="tx-confirmation">
        {confirmations}
      </span>
    </ValueAndLabel>
  );
};

export const Nonce = ({ t }) => {
  const {
    transaction: { nonce },
  } = useContext(Context);

  return (
    <ValueAndLabel className={styles.nonce} label={t('Nonce')}>
      <span>{nonce}</span>
    </ValueAndLabel>
  );
};

export const RequiredSignatures = ({ t }) => {
  const {
    transaction: { asset },
  } = useContext(Context);
  const requiredSignatures = asset.numberOfSignatures;

  return (
    <ValueAndLabel className={styles.requiredSignatures} label={t('Required signatures')}>
      <span className="tx-required-signatures">{requiredSignatures}</span>
    </ValueAndLabel>
  );
};

export const Members = ({ t }) => {
  const { transaction: { asset } } = useContext(Context);

  const { optionalKeys, mandatoryKeys } = asset;

  const members = useMemo(() => optionalKeys.map(publicKey => ({
    address: extractAddressFromPublicKey(publicKey),
    publicKey,
    mandatory: false,
  })).concat(
    mandatoryKeys.map(publicKey => ({
      address: extractAddressFromPublicKey(publicKey),
      publicKey,
      mandatory: true,
    })),
  ), [asset]);

  return (
    <MultiSignatureMembers t={t} members={members} className={styles.multiSignatureMembers} />
  );
};

export const BlockId = ({ t }) => {
  const { transaction } = useContext(Context);

  return (
    <ValueAndLabel className={styles.blockId} label={t('Block ID')}>
      <span>
        <CopyToClipboard
          value={transaction.block.id}
          text={truncateAddress(transaction.block.id)}
          className="block-id"
          containerProps={{
            size: 'xs',
            className: 'copy-title',
          }}
          copyClassName={styles.copyIcon}
        />
      </span>
    </ValueAndLabel>
  );
};

export const BlockHeight = ({ t }) => {
  const { transaction } = useContext(Context);

  return (
    <ValueAndLabel className={styles.blockHeight} label={t('Block height')}>
      <span>{transaction.block.height}</span>
    </ValueAndLabel>
  );
};

export const SignedAndRemainingMembersList = ({ t }) => {
  const { transaction, account } = useContext(Context);

  const isMultisignatureGroupRegistration = transaction.moduleAssetId
    === MODULE_ASSETS_NAME_ID_MAP.registerMultisignatureGroup;

  const keys = isMultisignatureGroupRegistration
    ? {
      optionalKeys: transaction.asset.optionalKeys,
      mandatoryKeys: transaction.asset.mandatoryKeys,
      numberOfSignatures: transaction.asset.numberOfSignatures,
    }
    : account.keys;

  const { signed, remaining } = useMemo(() => calculateRemainingAndSignedMembers(
    keys, transaction.signatures, isMultisignatureGroupRegistration,
  ), [account]);

  const required = isMultisignatureGroupRegistration
    ? keys.optionalKeys.length + keys.mandatoryKeys.length
    : keys.numberOfSignatures;

  const needed = required - signed.length;

  return (
    <SignedAndRemainingMembers
      signed={signed}
      remaining={remaining}
      needed={needed}
      required={required}
      className={styles.signedAndRemainingMembersList}
      t={t}
    />
  );
};
