import React from 'react';
import { getTransactionAmount } from '@transaction/utils/transaction';
import DiscreetMode from 'src/modules/common/components/discreetMode';
import { extractAddressFromPublicKey } from '@wallet/utils/account';
import TokenAmount from '@token/fungible/components/tokenAmount';
import TransactionDetailsContext from '../../context/transactionDetailsContext';
import ValueAndLabel from './valueAndLabel';
import styles from './styles.css';

const Amount = ({ t }) => {
  const { token, transaction } = React.useContext(TransactionDetailsContext);
  const addresses = [
    transaction.params.recipientAddress ?? '',
    extractAddressFromPublicKey(transaction.senderPublicKey),
  ];

  return (
    <ValueAndLabel label={t('Amount')} className={styles.amount}>
      <DiscreetMode addresses={addresses} shouldEvaluateForOtherAccounts>
        <span className="tx-amount">
          <TokenAmount val={getTransactionAmount(transaction)} token={token} />
        </span>
      </DiscreetMode>
    </ValueAndLabel>
  );
};

export default Amount;
