import React from 'react';
import { loginTypes } from '@constants';
import { toRawLsk, fromRawLsk } from '@utils/lsk';
import Piwik from '@utils/piwik';
import TransactionSummary from '@shared/transactionSummary';
import TransactionInfo from '@shared/transactionInfo';

import styles from './summary.css';

class Summary extends React.Component {
  constructor(props) {
    super(props);

    this.prevStep = this.prevStep.bind(this);
    this.submitTransaction = this.submitTransaction.bind(this);
  }

  componentDidUpdate() {
    this.checkForSuccessOrFailedTransactions();
  }

  submitTransaction({ secondPassphrase }) {
    Piwik.trackingEvent('Send_SubmitTransaction', 'button', 'Next step');
    const { fields } = this.props;

    this.props.transactionCreated({
      amount: `${toRawLsk(fields.amount.value)}`,
      data: fields.reference ? fields.reference.value : '',
      recipientAddress: fields.recipient.address,
      secondPassphrase,
      fee: toRawLsk(parseFloat(fields.fee.value)),
    });
  }

  checkForSuccessOrFailedTransactions() {
    const {
      account,
      fields,
      nextStep,
      transactions,
    } = this.props;

    if (account.loginType !== loginTypes.passphrase.code
        && transactions.transactionsCreatedFailed.length) {
      nextStep({
        fields: {
          ...fields,
          hwTransactionStatus: 'error',
        },
      });
    }

    if (transactions.transactionsCreated.length && !transactions.transactionsCreatedFailed.length) {
      nextStep({
        fields: {
          ...fields,
          hwTransactionStatus: false,
        },
      });
    }
  }

  prevStep() {
    Piwik.trackingEvent('Send_Summary', 'button', 'Previous step');
    this.props.resetTransactionResult();
    this.props.prevStep({ fields: this.props.fields });
  }

  render() {
    const {
      fields, t, token, account, isInitialization,
    } = this.props;
    const amount = fields.amount.value;

    return (
      <TransactionSummary
        title={t('Transaction summary')}
        t={t}
        account={account}
        confirmButton={{
          label: isInitialization ? t('Send') : t('Send {{amount}} {{token}}', { amount, token }),
          onClick: this.submitTransaction,
        }}
        cancelButton={{
          label: t('Edit transaction'),
          onClick: this.prevStep,
        }}
        showCancelButton={!isInitialization}
        fee={fromRawLsk(fields.fee.value)}
        token={token}
      >
        <TransactionInfo fields={fields} amount={amount} token={token} />
      </TransactionSummary>
    );
  }
}

export default Summary;
