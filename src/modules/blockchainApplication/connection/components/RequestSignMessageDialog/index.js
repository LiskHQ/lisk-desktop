import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { emptyTransactionsData } from 'src/redux/actions';
import Dialog from '@theme/dialog/dialog';
import BlockchainAppDetailsHeader from '@blockchainApplication/explore/components/BlockchainAppDetailsHeader';
import { useEvents } from '@libs/wcm/hooks/useEvents';
import { EVENTS } from '@libs/wcm/constants/lifeCycle';
import { useSession } from '@libs/wcm/hooks/useSession';
import { useCurrentAccount } from '@account/hooks';
import MultiStep from '@common/components/OldMultiStep';
import TxSignatureCollector from '@transaction/components/TxSignatureCollector';
import SignedMessage from '@message/components/signedMessage';
import { RequestSignMessageConfirmation } from '@blockchainApplication/connection/components/RequestSignMessageDialog/RequestSignMessageConfirmation';
import styles from './RequestSignMessageDialog.css';

// eslint-disable-next-line max-statements
const RequestSignMessageDialog = () => {
  const [multiStepPosition, setMultiStepPosition] = useState(0);
  const { t } = useTranslation();
  const { events } = useEvents();
  const { sessionRequest } = useSession();
  const [currentAccount] = useCurrentAccount();
  const history = useHistory();
  const reduxDispatch = useDispatch();

  const { peer, requiredNamespaces } = sessionRequest || {};
  const {
    metadata: { pubkey },
  } = currentAccount;
  const event = events?.find((e) => e.name === EVENTS.SESSION_REQUEST);
  const { message, address } = event?.meta?.params?.request?.params || {};

  const { icons, name, url } = peer?.metadata || {};

  const onMultiStepChange = useCallback(({ step: { current } }) => {
    setMultiStepPosition(current);
  }, []);

  const isPasswordStep = multiStepPosition === 1;

  useEffect(() => {
    reduxDispatch(emptyTransactionsData());
  }, []);

  return (
    <Dialog
      className={classNames(styles.RequestSignMessageDialog, {
        [styles.passwordStep]: isPasswordStep,
      })}
      hasClose
    >
      {!isPasswordStep && (
        <BlockchainAppDetailsHeader
          className={styles.blockchainAppDetailsHeaderProp}
          headerText={multiStepPosition === 2 ? t('Signed message') : t('Sign message')}
          application={{
            data: {
              name,
              projectPage: url?.replace(/\/$/, ''),
              icon: icons?.[0],
            },
          }}
          clipboardCopyItems={requiredNamespaces?.lisk?.chains?.map((chain) => ({
            label: 'Chain ID:',
            value: chain?.replace(/\D+/g, ''),
          }))}
        />
      )}
      <MultiStep
        className={classNames({
          [styles.multiStepProp]: !isPasswordStep,
        })}
        onChange={onMultiStepChange}
      >
        <RequestSignMessageConfirmation message={message} address={address} />
        <TxSignatureCollector
          type="message"
          transactionJSON={{ senderPublicKey: pubkey, params: {} }}
        />
        <SignedMessage history={history} account={currentAccount} />
      </MultiStep>
    </Dialog>
  );
};

export default RequestSignMessageDialog;
