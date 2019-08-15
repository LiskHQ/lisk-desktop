import React from 'react';
import { fromRawLsk, toRawLsk } from '../../../utils/lsk';
import { loginType } from '../../../constants/hwConstants';
import { tokenMap } from '../../../constants/tokens';
import AccountVisual from '../../accountVisual/index';
import Converter from '../../converter';
import Piwik from '../../../utils/piwik';
import TransactionSummary from '../../transactionSummary';
import fees from '../../../constants/fees';
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
    const { account, fields } = this.props;

    this.props.transactionCreated({
      amount: `${toRawLsk(fields.amount.value)}`,
      data: fields.reference.value,
      passphrase: account.passphrase,
      recipientId: fields.recipient.address,
      secondPassphrase,
      dynamicFeePerByte: this.props.fields.processingSpeed.value,
      fee: fees.send,
    });
  }

  checkForSuccessOrFailedTransactions() {
    const {
      account,
      fields,
      nextStep,
      transactions,
    } = this.props;

    if (account.loginType !== loginType.normal && transactions.transactionsCreatedFailed.length) {
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
    this.props.prevStep({ ...this.props.fields });
  }

  render() {
    const {
      fields, t, token, account,
    } = this.props;

    const fee = token === tokenMap.LSK.key
      ? fromRawLsk(fees.send)
      : fromRawLsk(fields.processingSpeed.txFee);

    return (
      <TransactionSummary
        title={t('Transaction summary')}
        t={t}
        account={account}
        confirmButton={{
          label: t('Send {{amount}} {{token}}', { amount: fields.amount.value, token }),
          onClick: this.submitTransaction,
        }}
        cancelButton={{
          label: t('Edit transaction'),
          onClick: this.prevStep,
        }}
        fee={fee}
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
            {`${fields.amount.value} ${token}`}
            <Converter className={styles.secondText} value={fields.amount.value} />
          </label>
        </section>
      </TransactionSummary>
    );
  }
}

export default Summary;
