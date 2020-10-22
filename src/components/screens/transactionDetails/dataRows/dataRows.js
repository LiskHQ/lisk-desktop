import React from 'react';

import { tokenMap } from '../../../../constants/tokens';
import Tooltip from '../../../toolbox/tooltip/tooltip';
import BoxRow from '../../../toolbox/box/row';

import {
  Message, Sender, Recipient, TransactionId, Amount, Date, Fee,
} from './baseComponents';
import styles from './styles.css';

export const SenderAndRecepient = ({
  transaction, activeToken, netCode, t,
}) => (
  <BoxRow>
    <Sender
      transaction={transaction}
      activeToken={activeToken}
      netCode={netCode}
    />
    <Recipient
      t={t}
      activeToken={activeToken}
      netCode={netCode}
      transaction={transaction}
    />
  </BoxRow>
);

export const TransactionIdAndAmount = ({
  t, id, addresses, transaction, activeToken,
}) => (
  <BoxRow>
    <TransactionId t={t} id={id} />
    <Amount t={t} transaction={transaction} addresses={addresses} activeToken={activeToken} />
  </BoxRow>
);

export const RequiredSigsAndFee = ({
  t, fee, requiredSignatures, activeToken,
}) => (
  <BoxRow>
    <div className={styles.value}>
      <p>{t('Required Signatures')}</p>
      <span>{requiredSignatures}</span>
    </div>
    <Fee t={t} fee={fee} activeToken={activeToken} />
  </BoxRow>
);

export const DateAndConfirmations = ({
  t, confirmations, activeToken, timestamp,
}) => (
  <BoxRow>
    <div className={`${styles.value}`}>
      <span className={styles.label}>
        {t('Confirmations')}
        <Tooltip position="top">
          <p>
            { t('Confirmations refer to the number of blocks added to the {{token}} blockchain after a transaction has been submitted. The more confirmations registered, the more secure the transaction becomes.', { token: tokenMap[activeToken].label })}
          </p>
        </Tooltip>
      </span>
      <span className="tx-confirmation">
        {confirmations || 0}
      </span>
    </div>
    <Date t={t} timestamp={timestamp} activeToken={activeToken} />
  </BoxRow>
);

export const MessageAndNonce = ({ t, transaction, activeToken }) => (
  <BoxRow>
    <Message t={t} transaction={transaction} activeToken={activeToken} />
    <div className={`${styles.value}`}>
      <span className={styles.label}>{t('Nonce')}</span>
      <span>{transaction.nonce}</span>
    </div>
  </BoxRow>
);

export const AmmountAndDate = ({
  transaction, activeToken, t, addresses,
}) => (
  <BoxRow>
    <Amount t={t} transaction={transaction} addresses={addresses} activeToken={activeToken} />
    <Date t={t} transaction={transaction} activeToken={activeToken} />
  </BoxRow>
);

export const FeeAndConfirmations = ({
  fee, confirmations = 0, activeToken, t,
}) => (
  <BoxRow>
    <Fee t={t} fee={fee} activeToken={activeToken} />
    <div className={`${styles.value}`}>
      <span className={styles.label}>
        {t('Confirmations')}
        <Tooltip position="top">
          <p>
            { t('Confirmations refer to the number of blocks added to the {{token}} blockchain after a transaction has been submitted. The more confirmations registered, the more secure the transaction becomes.', { token: tokenMap[activeToken].label })}
          </p>
        </Tooltip>
      </span>
      <span className="tx-confirmation">
        {confirmations}
      </span>
    </div>
  </BoxRow>
);
