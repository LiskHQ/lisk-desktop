import React from 'react';
import { loginTypes } from '@constants';
import { toRawLsk } from '@utils/lsk';
import Piwik from '@utils/piwik';
import AccountVisual from '@toolbox/accountVisual';
import Converter from '@shared/converter';
import TransactionSummary from '@shared/transactionSummary';
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
      fields, t, token, account,
    } = this.props;
    const amount = fields.amount.value;

    return (
      <TransactionSummary
        title={t('Transaction summary')}
        t={t}
        account={account}
        confirmButton={{
          label: t('Send {{amount}} {{token}}', { amount, token }),
          onClick: this.submitTransaction,
        }}
        cancelButton={{
          label: t('Edit transaction'),
          onClick: this.prevStep,
        }}
        fee={fields.fee.value}
        token={token}
      >
        <section>
          <label>{t('Recipient')}</label>
          <label className="recipient-value">
            <AccountVisual address={fields.recipient.address} size={25} />
            <label className={`${styles.information} recipient-confirm`}>
              {fields.recipient.title || fields.recipient.address}
            </label>
            { fields.recipient.title ? (
              <span className={styles.secondText}>
                {fields.recipient.address}
              </span>
            ) : null }
          </label>
        </section>
        <section>
          <label>{t('Amount')}</label>
          <label className="amount-summary">
            {`${amount} ${token}`}
            <Converter className={styles.secondText} value={amount} />
          </label>
        </section>
        { fields.reference && fields.reference.value
          ? (
            <section>
              <label>{t('Message')}</label>
              <label className="message-summary">
                {`${fields.reference.value}`}
              </label>
            </section>
          )
          : null }
      </TransactionSummary>
    );
  }
}

export default Summary;
