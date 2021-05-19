import React from 'react';
import { loginTypes, MODULE_ASSETS_NAME_ID_MAP } from '@constants';
import { toRawLsk, fromRawLsk } from '@utils/lsk';
import Piwik from '@utils/piwik';
import TransactionSummary from '@shared/transactionSummary';
import TransactionInfo from '@shared/transactionInfo';

class Summary extends React.Component {
  constructor(props) {
    super(props);

    this.callback = () => {};
    this.prevStep = this.prevStep.bind(this);
    this.submitTransaction = this.submitTransaction.bind(this);
  }

  componentDidUpdate() {
    this.checkForSuccessOrFailedTransactions();
  }

  componentDidMount() {
    this.submitTransaction(() => {});
  }

  submitTransaction(fn) {
    const { fields } = this.props;

    this.callback = fn;
    this.props.transactionCreated({
      amount: `${toRawLsk(fields.amount.value)}`,
      data: fields.reference ? fields.reference.value : '',
      recipientAddress: fields.recipient.address,
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

    if (false && !account.summary.isMultisignature) {
      Piwik.trackingEvent('Send_SubmitTransaction', 'button', 'Next step');
      if (account.loginType !== loginTypes.passphrase.code
          && transactions.transactionsCreatedFailed.length) {
        nextStep({
          fields: {
            ...fields,
            hwTransactionStatus: 'error',
          },
        });
      }

      if (transactions.transactionsCreated.length
        && !transactions.transactionsCreatedFailed.length) {
        nextStep({
          fields: {
            ...fields,
            hwTransactionStatus: false,
          },
        });
      }
    } else {
      // this.callback(transactions.transactionsCreated[0]);
    }
  }

  prevStep() {
    Piwik.trackingEvent('Send_Summary', 'button', 'Previous step');
    this.props.resetTransactionResult();
    this.props.prevStep({ fields: this.props.fields });
  }

  render() {
    const {
      fields, t, token, account, isInitialization, transactions,
    } = this.props;
    const amount = fields.amount.value;
    const transaction = transactions.transactionsCreated[0];
    console.log(transaction);

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
        createTransaction={this.submitTransaction}
      >
        <TransactionInfo
          fields={fields}
          amount={amount}
          token={token}
          transaction={transaction}
          moduleAssetId={MODULE_ASSETS_NAME_ID_MAP.transfer}
        />
      </TransactionSummary>
    );
  }
}

export default Summary;
