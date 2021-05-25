import React from 'react';
import moment from 'moment';
import { loginTypes, MODULE_ASSETS_NAME_ID_MAP } from '@constants';
import { toRawLsk } from '@utils/lsk';
import Piwik from '@utils/piwik';
import TransactionSummary from '@shared/transactionSummary';
import TransactionInfo from '@shared/transactionInfo';

class Summary extends React.Component {
  constructor(props) {
    super(props);

    this.date = moment().format('DD MMMM YYYY, h:mm:ss A');
    this.prevStep = this.prevStep.bind(this);
    this.submitTransaction = this.submitTransaction.bind(this);
  }

  componentDidMount() {
    const { fields } = this.props;

    this.props.transactionCreated({
      amount: `${toRawLsk(fields.amount.value)}`,
      data: fields.reference ? fields.reference.value : '',
      recipientAddress: fields.recipient.address,
      fee: toRawLsk(parseFloat(fields.fee.value)),
    });
  }

  submitTransaction(fn) {
    const {
      account,
      fields,
      nextStep,
      transactions,
    } = this.props;

    if (!account.summary.isMultisignature) {
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
      fn(transactions.transactionsCreated[0]);
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
    account.summary.isMultisignature = true;

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
        token={token}
        createTransaction={this.submitTransaction}
      >
        <TransactionInfo
          fields={fields}
          token={token}
          moduleAssetId={MODULE_ASSETS_NAME_ID_MAP.transfer}
          transaction={transaction || {}}
          account={account}
          date={this.date}
          isMultisignature={account.summary.isMultisignature}
        />
      </TransactionSummary>
    );
  }
}

export default Summary;
