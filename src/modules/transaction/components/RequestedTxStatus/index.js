import React, { useEffect, useContext, useState } from 'react';
import copyToClipboard from 'copy-to-clipboard';

import Icon from 'src/theme/Icon';
import { PrimaryButton, SecondaryButton } from 'src/theme/buttons';
import Illustration from 'src/modules/common/components/illustration';
import { txStatusTypes } from '@transaction/configuration/txStatus';
import { getErrorReportMailto } from 'src/utils/helpers';
import { useSession } from '@libs/wcm/hooks/useSession';
import ConnectionContext from '@libs/wcm/context/connectionContext';
import { EVENTS } from '@libs/wcm/constants/lifeCycle';
import { encodeTransaction, toTransactionJSON } from '../../utils/encoding';
import getIllustration from '../TxBroadcaster/illustrationsMap';
import styles from './RequestedTxStatus.css';

export const SuccessActions = ({ onClick, t, copied }) => (
  <PrimaryButton className={`${styles.button} respond-button`} onClick={onClick} disabled={copied}>
    <span className={styles.buttonContent}>
      <Icon name={copied ? 'transactionStatusSuccess' : 'copy'} />
      {copied ? t('Copied') : t('Copy and return to application')}
    </span>
  </PrimaryButton>
);

const ErrorActions = ({ t, status, message, network, application }) => (
  <a
    className="report-error-link"
    href={getErrorReportMailto({
      error: status?.message,
      errorMessage: message,
      networkIdentifier: network?.networkIdentifier,
      serviceUrl: network?.serviceUrl,
      liskCoreVersion: network?.networkVersion,
      application,
    })}
    target="_top"
    rel="noopener noreferrer"
  >
    <SecondaryButton>{t('Report the error via email')}</SecondaryButton>
  </a>
);

const RequestedTxStatus = ({
  transactions,
  title,
  message,
  t,
  status,
  className,
  resetTransactionResult,
  network,
  application,
}) => {
  const { respond } = useSession();
  const { events } = useContext(ConnectionContext);
  const [copied, setCopied] = useState(false);

  const onClick = () => {
    const event = events.find((e) => e.name === EVENTS.SESSION_REQUEST);
    const { schema } = event.meta.params.request.params;
    // prepare to copy
    copyToClipboard(JSON.stringify(toTransactionJSON(transactions.signedTransaction, schema)));
    setCopied(true);
    // encode tx
    const binary = encodeTransaction(transactions.signedTransaction, schema);
    const payload = binary.toString('hex');
    // send to initiator using wcm hooks
    respond({ payload });
  };

  useEffect(() => resetTransactionResult, []);

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <Illustration
        name={getIllustration(status.code, 'signMultisignature')}
        data-testid="illustration"
      />
      <h6 className="result-box-header">{title}</h6>
      <p className="transaction-status body-message">{message}</p>

      <div className={styles.primaryActions}>
        {status.code === txStatusTypes.signatureError ? (
          <ErrorActions
            message={message}
            network={network}
            status={status}
            t={t}
            application={application}
          />
        ) : (
          <SuccessActions onClick={onClick} t={t} copied={copied} />
        )}
      </div>
    </div>
  );
};

export default RequestedTxStatus;
