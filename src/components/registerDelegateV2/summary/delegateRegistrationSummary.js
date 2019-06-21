import React from 'react';
import AccountVisual from '../../accountVisual/index';
import { fromRawLsk } from '../../../utils/lsk';
import Fees from '../../../constants/fees';
import TransactionSummary from '../../transactionSummary';
import styles from './summary.css';

class DelegateRegistrationSummary extends React.Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit({ secondPassphrase }) {
    const {
      account, nickname, delegateRegistered, nextStep,
    } = this.props;

    delegateRegistered({
      account: account.info.LSK,
      username: nickname,
      passphrase: account.passphrase,
      secondPassphrase,
    });

    nextStep();
  }

  render() {
    const {
      t, nickname, account, prevStep,
    } = this.props;

    return (
      <TransactionSummary
        title={t('Become a delegate summary')}
        t={t}
        account={account}
        confirmButton={{
          label: t('Become a delegate'),
          onClick: this.onSubmit,
        }}
        cancelButton={{
          label: t('Go back'),
          onClick: () => {
            prevStep({ nickname });
          },
        }}
        fee={fromRawLsk(Fees.registerDelegate)}
      >
        <section>
          <label>{t('Your nickname')}</label>
          <label className={styles.userInformation}>
            <AccountVisual
              className={styles.accountVisual}
              address={account.info.LSK.address}
              size={23}
            />
            <span className={styles.nickname}>{nickname}</span>
            <span className={styles.address}>{account.info.LSK.address}</span>
          </label>
        </section>
      </TransactionSummary>
    );
  }
}

export default DelegateRegistrationSummary;
