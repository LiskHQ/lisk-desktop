import React, { useEffect, useContext } from 'react';
import { PrimaryButton, SecondaryButton } from 'src/theme/buttons';
import Illustration from 'src/modules/common/components/illustration';
import routes from 'src/routes/routes';
import { txStatusTypes } from '@transaction/configuration/txStatus';
import { getErrorReportMailto } from 'src/utils/helpers';

import useSession from '@libs/wcm/hooks/useSession';
import ConnectionContext from '@libs/wcm/context/connectionContext';
import { EVENTS } from '@libs/wcm/constants/lifeCycle';
import { encodeTransaction } from '../../utils/encoding';
import getIllustration from '../TxBroadcaster/illustrationsMap';
import styles from './RequestedTxStatus.css';

export const SuccessActions = ({ onClick, t }) => (
  <PrimaryButton
    className="respond-button"
    onClick={onClick}
  >
    <span className={styles.buttonContent}>
      {t('Send to initiator')}
    </span>
  </PrimaryButton>
);

const ErrorActions = ({
  t, status, message, network,
}) => (
  <a
    className="report-error-link"
    href={getErrorReportMailto({
      error: status.message,
      errorMessage: message,
      networkIdentifier: network.networkIdentifier,
      serviceUrl: network.serviceUrl,
      liskCoreVersion: network.networkVersion,
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
  history,
  resetTransactionResult,
  account,
  network,
}) => {
  const { respond } = useSession();
  const { events } = useContext(ConnectionContext);

  const onClick = () => {
    const event = events.find(e => e.name === EVENTS.SESSION_REQUEST);
    const { schema } = event.meta.params.request.params
    // encode tx
    const binary = encodeTransaction(transactions.signedTransaction, schema);
    const payload = binary.toString('hex');
    // send to initiator using wcm hooks
    respond({ payload });
    // redirect to dashboard
    history.push(routes.wallet.path);
  };

  const goToWallet = () => {
    history.push(routes.wallet.path);
  };

  useEffect(() => resetTransactionResult, []);

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <Illustration
        name={getIllustration(
          status.code,
          'signMultisignature',
          account.hwInfo,
        )}
      />
      <h6 className="result-box-header">{title}</h6>
      <p className="transaction-status body-message">{message}</p>

      <div className={styles.primaryActions}>
        {status.code === txStatusTypes.broadcastSuccess ? (
          <PrimaryButton
            className={`${styles.backToWallet} back-to-wallet-button`}
            onClick={goToWallet}
          >
            {t('Back to wallet')}
          </PrimaryButton>
        ) : null}
        {
          status.code === txStatusTypes.broadcastError
          ? (
            <ErrorActions
              message={message}
              network={network}
              status={status}
              t={t}
            />
          )
          : (
            <SuccessActions onClick={onClick} t={t} />
          )
        }
      </div>
    </div>
  );
};

export default RequestedTxStatus;
