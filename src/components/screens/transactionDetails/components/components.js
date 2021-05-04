import React, { useContext, useMemo } from 'react';

import { getModuleAssetTitle, getModuleAssetSenderLabel } from '@utils/moduleAssets';
import CopyToClipboard from '../../../toolbox/copyToClipboard';
import TransactionTypeFigure from '../../../shared/transactionTypeFigure';
import { tokenMap } from '../../../../constants/tokens';
import { DateTimeFromTimestamp } from '../../../toolbox/timestamp';
import DiscreetMode from '../../../shared/discreetMode';
import LiskAmount from '../../../shared/liskAmount';
import MultiSignatureMembers from '../../../shared/multisignatureMembers';

import AccountInfo from './accountInfo';
import styles from './styles.css';
import Tooltip from '../../../toolbox/tooltip/tooltip';
import { Context } from '../transactionDetails';
import { extractAddress } from '../../../../utils/account';

const getDelegateName = (transaction, activeToken) => (
  (activeToken === tokenMap.LSK.key
  && transaction.asset
  && transaction.asset.username) ? transaction.asset.username : null
);

const getTxAsset = (tx) => {
  if (typeof tx.asset === 'object' && tx.asset !== null && typeof tx.asset.data === 'string') {
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
  const { transaction: { senderId, type } } = useContext(Context);
  const title = getModuleAssetTitle()[type];

  return (
    <div className={styles.illustration}>
      <TransactionTypeFigure
        address={senderId}
        transactionType={type}
      />
      <h2 className="tx-header">{title}</h2>
    </div>
  );
};

export const Sender = () => {
  const {
    activeToken, netCode, transaction,
  } = useContext(Context);
  const delegateName = getDelegateName(transaction, activeToken);
  const senderLabel = getModuleAssetSenderLabel()[transaction.type];

  return (
    <AccountInfo
      className={`${styles.value} ${styles.sender}`}
      name={delegateName}
      token={activeToken}
      netCode={netCode}
      address={transaction.senderId}
      addressClass="sender-address"
      label={senderLabel}
    />
  );
};

export const Recipient = ({ t }) => {
  const {
    activeToken, netCode, transaction: { recipientId },
  } = useContext(Context);

  return (
    <AccountInfo
      className={`${styles.value} ${styles.recipient}`}
      token={activeToken}
      netCode={netCode}
      address={recipientId}
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
    activeToken, transaction: { amount, recipientId, senderId },
  } = useContext(Context);

  return (
    <ValueAndLabel label={t('Amount of Transaction')} className={styles.amount}>
      <DiscreetMode addresses={[recipientId, senderId]} shouldEvaluateForOtherAccounts>
        <span className="tx-amount">
          <LiskAmount val={amount} />
          {' '}
          {activeToken}
        </span>
      </DiscreetMode>
    </ValueAndLabel>
  );
};

export const Date = ({ t }) => {
  const {
    activeToken, transaction: { timestamp },
  } = useContext(Context);

  return (
    <ValueAndLabel label={t('Date')} className={styles.date}>
      <span className={`${styles.date} tx-date`}>
        <DateTimeFromTimestamp
          fulltime
          className="date"
          time={timestamp}
          token={activeToken}
          showSeconds
        />
      </span>
    </ValueAndLabel>
  );
};

export const Fee = ({ t }) => {
  const {
    activeToken, transaction: { fee },
  } = useContext(Context);

  return (
    <ValueAndLabel label={t('Transaction fee')} className={styles.fee}>
      <span className="tx-fee">
        <LiskAmount val={fee} />
        {' '}
        {activeToken}
      </span>
    </ValueAndLabel>
  );
};

export const Confirmations = ({ t }) => {
  const {
    activeToken, transaction: { confirmations },
  } = useContext(Context);

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
    <ValueAndLabel className={styles.requiredSignatures} label={t('Required Signatures')}>
      <span>{requiredSignatures}</span>
    </ValueAndLabel>
  );
};

export const Members = ({ t }) => {
  const { transaction: { asset } } = useContext(Context);

  const { optionalKeys, mandatoryKeys } = asset;

  const members = useMemo(() => optionalKeys.map(publicKey => ({
    address: extractAddress(publicKey),
    publicKey,
    mandatory: false,
  })).concat(
    mandatoryKeys.map(publicKey => ({
      address: extractAddress(publicKey),
      publicKey,
      mandatory: true,
    })),
  ), [asset]);

  return (
    <MultiSignatureMembers t={t} members={members} className={styles.multiSignatureMembers} />
  );
};
