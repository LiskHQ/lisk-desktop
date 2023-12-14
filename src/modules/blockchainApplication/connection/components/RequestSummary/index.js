/* eslint-disable max-lines */
/* eslint-disable complexity */
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import ValueAndLabel from '@transaction/components/TransactionDetails/valueAndLabel';
import AccountRow from '@account/components/AccountRow';
import { useCurrentAccount } from '@account/hooks';
import { useAccounts } from '@account/hooks/useAccounts';
import { useCurrentApplication } from '@blockchainApplication/manage/hooks';
import { emptyTransactionsData } from 'src/redux/actions';
import { extractAddressFromPublicKey, truncateAddress } from '@wallet/utils/account';
import { SIGNING_METHODS } from '@libs/wcm/constants/permissions';
import { EVENTS } from '@libs/wcm/constants/lifeCycle';
import { useAppsMetaTokens } from '@token/fungible/hooks/queries/useAppsMetaTokens';
import { toTransactionJSON } from '@transaction/utils/encoding';
import { useBlockchainApplicationMeta } from '@blockchainApplication/manage/hooks/queries/useBlockchainApplicationMeta';
import { convertFromBaseDenom } from '@token/fungible/utils/helpers';
import { joinModuleAndCommand } from '@transaction/utils/moduleCommand';
import { signMessage } from '@message/store/action';
import { addSearchParamsToUrl, removeSearchParamsFromUrl } from 'src/utils/searchParams';
import { validator } from '@liskhq/lisk-client';
import { useSession } from '@libs/wcm/hooks/useSession';
import { useEvents } from '@libs/wcm/hooks/useEvents';
import { useSchemas } from '@transaction/hooks/queries/useSchemas';
import { useDeprecatedAccount } from '@account/hooks/useDeprecatedAccount';
import { PrimaryButton, SecondaryButton, TertiaryButton } from 'src/theme/buttons';
import { decodeTransaction } from '@transaction/utils';
import Box from 'src/theme/box';
import routes from 'src/routes/routes';
import BlockchainAppDetailsHeader from '@blockchainApplication/explore/components/BlockchainAppDetailsHeader';
import WarningNotification from '@common/components/warningNotification';
import { USER_REJECT_ERROR } from '@libs/wcm/utils/jsonRPCFormat';
import { ReactComponent as SwitchIcon } from '../../../../../../setup/react/assets/images/icons/switch-icon.svg';
import EmptyState from './EmptyState';
import styles from './requestSummary.css';

const getTitle = (key, t) =>
  Object.values(SIGNING_METHODS).find((item) => item.key === key)?.title ?? t('Method not found.');
const defaultToken = { symbol: 'LSK' };

// eslint-disable-next-line max-statements
const RequestSummary = ({ nextStep, history, message }) => {
  const { t } = useTranslation();
  const { getAccountByAddress, accounts } = useAccounts();
  const [currentAccount, setCurrentAccount] = useCurrentAccount();
  const [currentApplication] = useCurrentApplication();
  const { events } = useEvents();
  const [request, setRequest] = useState(null);
  const [transaction, setTransaction] = useState(null);
  const [senderAccount, setSenderAccount] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const { sessionRequest, respond } = useSession({ isEnabled: !message });
  const reduxDispatch = useDispatch();
  const metaData = useBlockchainApplicationMeta();
  useDeprecatedAccount(senderAccount);
  useSchemas();

  const encryptedSenderAccount = getAccountByAddress(senderAccount?.address);
  const isSenderCurrentAccount = currentAccount.metadata?.address === senderAccount?.address;
  const signingAccountDetails = useMemo(() => {
    if (encryptedSenderAccount) {
      return `(${encryptedSenderAccount.metadata.name} - ${truncateAddress(
        senderAccount?.address
      )})`;
    }
    return senderAccount?.address;
  }, [encryptedSenderAccount, senderAccount]);

  const sendingChainID = request?.chainId?.replace('lisk:', '');
  const { data: tokenData } = useAppsMetaTokens({
    config: { params: { chainID: sendingChainID } },
  });

  /* istanbul ignore next */
  const navigateToAddAccountFlow = () => {
    history.push(routes.addAccountOptions.path);
  };

  const approveHandler = () => {
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!message) {
      nextStep({
        message,
        actionFunction: (formProps, _, privateKey) =>
          reduxDispatch(signMessage({ message, nextStep, privateKey, currentAccount })),
      });
    } else {
      const moduleCommand = joinModuleAndCommand(transaction);
      const transactionJSON = toTransactionJSON(transaction, request?.request?.params.schema);
      const token = tokenData?.data?.length > 0 ? tokenData?.data[0] : defaultToken;

      nextStep({
        transactionJSON,
        formProps: {
          composedFees: [
            {
              title: 'Transaction',
              value: `${convertFromBaseDenom(transaction.fee)} ${token?.symbol}`,
              components: [],
            },
          ],
          moduleCommand,
          chainID: sendingChainID,
          schema: request?.request?.params.schema,
          url: sessionRequest.peer.metadata.url,
        },
        selectedPriority: { title: 'Normal', selectedIndex: 0, value: 0 },
      });
    }
  };
  const rejectHandler = async () => {
    await respond({ payload: USER_REJECT_ERROR });
    removeSearchParamsFromUrl(history, ['modal', 'status', 'name', 'action']);
  };

  useEffect(() => {
    reduxDispatch(emptyTransactionsData());
  }, []);

  useEffect(() => {
    const event = events.find((e) => e.name === EVENTS.SESSION_REQUEST);
    const hasRequest = event?.meta?.params?.request?.params;
    if (hasRequest) {
      const eventChainId = event?.meta?.params?.chainId?.replace('lisk:', '');
      if (currentApplication.chainID !== eventChainId) {
        setErrorMessage(
          t('Please switch application/network to selected value during connection initialization')
        );
      } else {
        setRequest({
          id: event.meta.id,
          ...event.meta.params,
        });
      }
    }
  }, []);

  // eslint-disable-next-line max-statements
  useEffect(() => {
    if (request && !transaction) {
      try {
        const { payload, schema, address: publicKey } = request.request.params;
        let transactionObj;

        if (!message) {
          validator.validator.validateSchema(schema);
          transactionObj = decodeTransaction(Buffer.from(payload, 'hex'), schema);
          validator.validator.validate(schema, transactionObj.params);
          setTransaction(transactionObj);
        }

        const senderPublicKey = !message ? transactionObj.senderPublicKey : publicKey;
        const address = extractAddressFromPublicKey(senderPublicKey);
        const account = getAccountByAddress(address);
        setSenderAccount({
          address,
          pubkey: senderPublicKey,
          name: account?.metadata?.name,
        });
        setErrorMessage('');
      } catch (error) {
        setErrorMessage(error.message);
      }
    }
  }, [request]);

  if ((!sessionRequest || !request) && !message) {
    return <EmptyState history={history} />;
  }

  const { icons = [], name, url = '' } = sessionRequest?.peer?.metadata || {};

  const application = {
    data: {
      name,
      projectPage: url.replace(/\/$/, ''),
      icon: icons[0],
    },
  };

  const clipboardCopyItems = sessionRequest?.requiredNamespaces?.lisk?.chains?.map((chain) => ({
    label: 'Chain ID:',
    value: chain.replace(/\D+/g, ''),
  }));

  /* istanbul ignore next */
  const handleSwitchAccount = () => {
    setCurrentAccount(
      encryptedSenderAccount,
      `/wallet?modal=${!message ? 'requestView' : 'requestSignMessageDialog'}`
    );
  };

  if (!currentAccount.metadata || accounts.length === 0) {
    addSearchParamsToUrl(history, {
      modal: 'NoAccountView',
      mode: accounts.length === 0 ? 'EMPTY_ACCOUNT_LIST' : 'NO_CURRENT_ACCOUNT',
    });
    return null;
  }

  return (
    <div className={`${styles.wrapper}`}>
      {!message && (
        <BlockchainAppDetailsHeader
          headerText={getTitle(request?.request?.method, t)}
          application={application}
          clipboardCopyItems={clipboardCopyItems}
        />
      )}
      <Box>
        <div className={styles.information}>
          <ValueAndLabel className={styles.labeledValue} label={t('Information')}>
            {!errorMessage ? (
              <span>
                {t(
                  'This transaction was initiated from another application for signature request.'
                )}
              </span>
            ) : (
              <div className={styles.invalidTransactionTextContainer}>
                <span>{t('Invalid transaction initiated from another application/network.')}</span>
                <span className={styles.errorMessage}>{errorMessage}</span>
              </div>
            )}
          </ValueAndLabel>
          {!errorMessage && (
            <>
              <ValueAndLabel
                className={styles.labeledValue}
                label={
                  <div className={styles.switchAccountHeader}>
                    <span>{t('Current account')}</span>
                    {!isSenderCurrentAccount && !!encryptedSenderAccount && (
                      <TertiaryButton onClick={handleSwitchAccount}>
                        <span>{t('Switch to signing account')}</span>{' '}
                        <SwitchIcon data-testid="switch-icon" />
                      </TertiaryButton>
                    )}
                  </div>
                }
              >
                <>
                  <AccountRow
                    truncate
                    className={classNames(styles.accountRow, {
                      [styles.disabledAccountRow]:
                        !isSenderCurrentAccount || !encryptedSenderAccount,
                    })}
                    account={currentAccount}
                  />
                  <WarningNotification
                    isVisible={!isSenderCurrentAccount || !encryptedSenderAccount}
                    message={
                      !encryptedSenderAccount ? (
                        <>
                          <span>
                            {t(
                              'The selected account for signing the requested transaction is missing. Please add the missing account “'
                            )}
                          </span>
                          <b>{signingAccountDetails}</b>
                          <span>
                            {t(
                              '” to Lisk Desktop and re-initiate the transaction signing from the external application.'
                            )}
                          </span>
                        </>
                      ) : (
                        <>
                          <span>{t('Please click on “Switch to signing account” ')}</span>
                          <b>{signingAccountDetails}</b>
                          <span>{t(' to complete the request.')}</span>
                        </>
                      )
                    }
                  />
                </>
              </ValueAndLabel>
            </>
          )}
        </div>
        <footer className={styles.actionBar}>
          <SecondaryButton
            className={styles.button}
            onClick={rejectHandler}
            data-testid="cancel-button"
          >
            {t('Cancel')}
          </SecondaryButton>
          <PrimaryButton
            className={styles.button}
            onClick={!encryptedSenderAccount ? navigateToAddAccountFlow : approveHandler}
            data-testid="approve-button"
            disabled={
              !metaData.data ||
              errorMessage ||
              (!isSenderCurrentAccount && !!encryptedSenderAccount)
            }
          >
            {!encryptedSenderAccount ? t('Add account') : t('Continue')}
          </PrimaryButton>
        </footer>
      </Box>
    </div>
  );
};

export default RequestSummary;
