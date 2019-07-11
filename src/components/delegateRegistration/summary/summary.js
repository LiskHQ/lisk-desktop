import React from 'react';
import to from 'await-to-js';

import TransactionSummary from '../../transactionSummary';
import AccountVisual from '../../accountVisual/index';
import { fromRawLsk } from '../../../utils/lsk';
import Fees from '../../../constants/fees';
import { create } from '../../../utils/api/lsk/transactions';
import { createTransactionType } from '../../../constants/transactionTypes';
import styles from './summary.css';

class Summary extends React.Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  async onSubmit({ secondPassphrase }) {
    const {
      account,
      nextStep,
      nickname,
    } = this.props;

    const data = {
      account,
      username: nickname,
      passphrase: account.passphrase,
      secondPassphrase,
    };

    const [error, tx] = await to(create(data, createTransactionType.delegate_registration));
    if (!error) nextStep({ transactionInfo: tx });
  }

  render() {
    const {
      account,
      nickname,
      prevStep,
      t,
    } = this.props;

    const onConfirmAction = {
      label: t('Become a delegate'),
      onClick: this.onSubmit,
    };
    const onCancelAction = {
      label: t('Go back'),
      onClick: () => { prevStep({ nickname }); },
    };

    return (
      <TransactionSummary
        title={t('Become a delegate summary')}
        t={t}
        account={account}
        confirmButton={onConfirmAction}
        cancelButton={onCancelAction}
        fee={fromRawLsk(Fees.registerDelegate)}
        classNames={styles.summaryContainer}
      >
        <section className="summary-container">
          <label className="nickname-label">{t('Your nickname')}</label>
          <div className={styles.userInformation}>
            <AccountVisual
              className={styles.accountVisual}
              address={account.address}
              size={25}
            />
            <span className={`${styles.nickname} nickname`}>{nickname}</span>
            <span className={`${styles.address} address`}>{account.address}</span>
          </div>
        </section>
      </TransactionSummary>
    );
  }
}

export default Summary;
