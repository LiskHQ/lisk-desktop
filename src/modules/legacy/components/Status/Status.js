import React from 'react';
import TxBroadcaster from '@transaction/components/TxBroadcaster';
import { getTransactionStatus } from '@transaction/configuration/statusConfig';
import { txStatusTypes } from '@transaction/configuration/txStatus';
import statusMessages from './statusMessages';
import styles from './status.css';

const successTypes = [
  txStatusTypes.multisigSignaturePartialSuccess,
  txStatusTypes.multisigSignatureSuccess,
  txStatusTypes.multisigBroadcastSuccess,
  txStatusTypes.broadcastSuccess,
];

const Status = ({ account, transactions, t, prevStep }) => {
  const status = getTransactionStatus(account, transactions, account.summary.isMultisignature);
  const template = statusMessages(t)[status.code];

  return (
    <div className={`${styles.wrapper} status-container`}>
      <TxBroadcaster
        illustration="default"
        status={status}
        title={template.title}
        message={!successTypes.includes(status.code) ? template.message : ''}
        className={styles.content}
        onRetry={prevStep}
      >
        {({ status: { code } }) =>
          successTypes.includes(code) && (
            <secton className={styles.reclaimStatusSection}>
              <ul>
                <li className={`${styles.step} ${styles.check}`}>
                  <span>{t('0.1 LSK was deposited on your account')}</span>
                </li>
                <li className={`${styles.step} ${styles.check}`}>
                  <span>{t('Reclaim transaction was sent')}</span>
                </li>
              </ul>
              <p>{template.message}</p>
            </secton>
          )
        }
      </TxBroadcaster>
    </div>
  );
};

export default Status;
