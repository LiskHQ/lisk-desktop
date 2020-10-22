import React from 'react';

import BoxRow from '../../../toolbox/box/row';

import {
  Message, Sender, Recipient, TransactionId, Amount, Date, Fee, ValueAndLabel, Confirmations,
} from './baseComponents';

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
    <ValueAndLabel label={t('Required Signatures')}>
      <span>{requiredSignatures}</span>
    </ValueAndLabel>
    <Fee t={t} fee={fee} activeToken={activeToken} />
  </BoxRow>
);

export const DateAndConfirmations = ({
  t, confirmations, activeToken, timestamp,
}) => (
  <BoxRow>
    <Date t={t} timestamp={timestamp} activeToken={activeToken} />
    <Confirmations t={t} confirmations={confirmations} />
  </BoxRow>
);

export const MessageAndNonce = ({ t, transaction, activeToken }) => (
  <BoxRow>
    <Message t={t} transaction={transaction} activeToken={activeToken} />
    <ValueAndLabel label={t('Nonce')}>
      <span>{transaction.nonce}</span>
    </ValueAndLabel>
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
    <Confirmations t={t} confirmations={confirmations} />
  </BoxRow>
);
