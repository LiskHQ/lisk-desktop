import React from 'react';
import to from 'await-to-js';

import { create } from '@utils/api/transaction';
import { toRawLsk } from '@utils/lsk';
import { tokenMap, transactionTypes } from '@constants';
import styles from './summary.css';
import AccountVisual from '../../../toolbox/accountVisual';
import TransactionSummary from '../../../shared/transactionSummary';

class Summary extends React.Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  async onSubmit() {
    const {
      account,
      nextStep,
      nickname,
      network,
      fee,
    } = this.props;

    const data = {
      account,
      username: nickname,
      passphrase: account.passphrase,
      fee: toRawLsk(parseFloat(fee)),
      network,
      nonce: account.nonce,
      transactionType: transactionTypes().registerDelegate.key,
    };

    const [error, tx] = await to(
      create(data, tokenMap.LSK.key),
    );

    if (!error) {
      nextStep({ transactionInfo: tx });
    }
  }

  render() {
    const {
      account,
      nickname,
      prevStep,
      fee,
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
        title={t('Summary of delegate registration')}
        t={t}
        account={account}
        confirmButton={onConfirmAction}
        cancelButton={onCancelAction}
        fee={fee}
        classNames={`${styles.box} ${styles.summaryContainer}`}
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
