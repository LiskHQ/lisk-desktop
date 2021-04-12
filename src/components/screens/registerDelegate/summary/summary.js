import React from 'react';
import to from 'await-to-js';

import { create } from '@api/transaction';
import { toRawLsk } from '@utils/lsk';
import { tokenMap, MODULE_ASSETS_NAME_ID_MAP } from '@constants';
import AccountVisual from '@toolbox/accountVisual';
import TransactionSummary from '@shared/transactionSummary';
import styles from './summary.css';

const moduleAssetId = MODULE_ASSETS_NAME_ID_MAP.registerDelegate;

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
      moduleAssetId,
      network,
      senderPublicKey: account.info.LSK.summary.publicKey,
      passphrase: account.passphrase,
      nonce: account.sequence?.nonce,
      fee: toRawLsk(parseFloat(fee)),
      username: nickname,
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
              address={account.summary?.address}
              size={25}
            />
            <span className={`${styles.nickname} nickname`}>{nickname}</span>
            <span className={`${styles.address} address`}>{account.summary?.address}</span>
          </div>
        </section>
      </TransactionSummary>
    );
  }
}

export default Summary;
