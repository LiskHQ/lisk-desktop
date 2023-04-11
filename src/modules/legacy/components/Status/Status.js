import React from 'react';
import { useSelector } from 'react-redux';
import TxBroadcaster from '@transaction/components/TxBroadcaster';
import { getTransactionStatus } from '@transaction/configuration/statusConfig';
import { txStatusTypes } from '@transaction/configuration/txStatus';
import { selectModuleCommandSchemas } from 'src/redux/selectors';

import statusMessages from './statusMessages';
import styles from './status.css';

const successTypes = [
  txStatusTypes.multisigSignaturePartialSuccess,
  txStatusTypes.multisigSignatureSuccess,
  txStatusTypes.multisigBroadcastSuccess,
  txStatusTypes.broadcastSuccess,
];

const Status = ({ account, transactions, t, prevStep }) => {
  const moduleCommandSchemas = useSelector(selectModuleCommandSchemas);
  const status = getTransactionStatus(account, transactions, { moduleCommandSchemas });
  const template = statusMessages(t)[status.code];
  const reclaimedAmount = transactions?.signedTransaction?.params?.amount;

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
            <section className={styles.reclaimStatusSection}>
              <ul>
                <li className={`${styles.step} ${styles.check}`}>
                  <span>
                    {t('{{reclaimedAmount}} LSK will be deposited in your account', {
                      reclaimedAmount,
                    })}
                  </span>
                </li>
                <li className={`${styles.step} ${styles.check}`}>
                  <span>{t('Reclaim transaction was sent')}</span>
                </li>
              </ul>
              <p>{template.message}</p>
            </section>
          )
        }
      </TxBroadcaster>
    </div>
  );
};

export default Status;
