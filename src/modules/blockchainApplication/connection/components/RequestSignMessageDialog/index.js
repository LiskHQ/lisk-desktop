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
import { USER_REJECT_ERROR } from '@libs/wcm/utils/jsonRPCFormat';
import styles from './RequestSignMessageDialog.css';
import RequestSummary, { getTitle } from '../RequestSummary';

// eslint-disable-next-line max-statements
const RequestSignMessageDialog = () => {
  const [multiStepPosition, setMultiStepPosition] = useState(0);
  const [isErrorView, setIsErrorView] = useState(false);
  const { t } = useTranslation();
  const { events } = useEvents();
  const { sessionRequest, respond } = useSession();
  const [currentAccount] = useCurrentAccount();
  const history = useHistory();
  const reduxDispatch = useDispatch();

  const { peer, requiredNamespaces } = sessionRequest || {};
  const event = events?.find((e) => e.name === EVENTS.SESSION_REQUEST);
  const { method, params: { message, address, portalMessage } = {} } =
    event?.meta?.params?.request || {};
  const { icons, name, url } = peer?.metadata || {};

  /* istanbul ignore next */
  const onMultiStepChange = useCallback((multistepState) => {
    setIsErrorView(false);
    const { step: { current, data } = {} } = multistepState || {};
    const statusState = data?.[3];
    const hasError = !!statusState?.error;

    if (hasError) {
      setIsErrorView(hasError);
    }
    setMultiStepPosition(current);
  }, []);

  const isPasswordStep = multiStepPosition === 2;

  useEffect(() => {
    reduxDispatch(emptyTransactionsData());
  }, []);

  /* istanbul ignore next */
  const onCloseIcon = async () => {
    const isStatusView = multiStepPosition === 3;
    if (!isStatusView) {
      await respond({ payload: USER_REJECT_ERROR });
    }
  };

  return (
    <Dialog
      className={classNames(styles.RequestSignMessageDialog, {
        [styles.passwordStep]: isPasswordStep,
      })}
      hasClose
      onCloseIcon={onCloseIcon}
      size={isErrorView && 'sm'}
    >
      {!isPasswordStep && !isErrorView && (
        <BlockchainAppDetailsHeader
          className={styles.blockchainAppDetailsHeaderProp}
          headerText={
            // eslint-disable-next-line no-nested-ternary
            isPasswordStep ? t('Signed message') : method ? getTitle(method, t) : 'Sign message'
          }
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
        <RequestSummary history={history} message={message} portalMessage={portalMessage} />
        <RequestSignMessageConfirmation message={message} address={address} />
        <TxSignatureCollector
          type="message"
          transactionJSON={{ senderPublicKey: currentAccount.metadata?.pubkey, params: {} }}
        />
        <SignedMessage history={history} account={currentAccount} />
      </MultiStep>
    </Dialog>
  );
};

export default RequestSignMessageDialog;
