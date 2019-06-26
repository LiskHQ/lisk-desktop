import React from 'react';
import AccountVisual from '../../accountVisual/index';
import { fromRawLsk } from '../../../utils/lsk';
import Fees from '../../../constants/fees';
import TransactionSummary from '../../transactionSummary';
import styles from './summary.css';

class Summary extends React.Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit({ secondPassphrase }) {
    const {
      account, nickname, submitDelegateRegistration, nextStep,
    } = this.props;

    const data = {
      account: account.info.LSK,
      username: nickname,
      passphrase: account.passphrase,
      secondPassphrase,
    };

    submitDelegateRegistration(data);
    nextStep({ userinfo: data });
  }

  render() {
    const {
      t, nickname, account, prevStep,
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
        <section className={'summary-container'}>
          <label className={'nickname-label'}>{t('Your nickname')}</label>
          <label className={styles.userInformation}>
            <AccountVisual
              className={styles.accountVisual}
              address={account.info.LSK.address}
              size={23}
            />
            <span className={`${styles.nickname} nickname`}>{nickname}</span>
            <span className={`${styles.address} address`}>{account.info.LSK.address}</span>
          </label>
        </section>
      </TransactionSummary>
    );
  }
}

export default Summary;
