/* istanbul ignore file */ // @todo Add unit tests by #4824
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ValueAndLabel from '@transaction/components/TransactionDetails/valueAndLabel';
import AccountRow from '@account/components/AccountRow';
import { useAccounts } from '@account/hooks/useAccounts';
import { extractAddressFromPublicKey } from '@wallet/utils/account';
import { SIGNING_METHODS } from '@libs/wcm/constants/permissions';
import { EVENTS, ERROR_CASES } from '@libs/wcm/constants/lifeCycle';
import { formatJsonRpcError } from '@libs/wcm/utils/jsonRPCFormat';
import { useAppsMetaTokens } from '@token/fungible/hooks/queries/useAppsMetaTokens';
import { toTransactionJSON } from '@transaction/utils/encoding';
import { useBlockchainApplicationMeta } from '@blockchainApplication/manage/hooks/queries/useBlockchainApplicationMeta';
import { convertFromBaseDenom } from '@token/fungible/utils/helpers';
import { joinModuleAndCommand } from '@transaction/utils/moduleCommand';
import { removeSearchParamsFromUrl } from 'src/utils/searchParams';
import { validator } from '@liskhq/lisk-client';
import { useSession } from '@libs/wcm/hooks/useSession';
import { useEvents } from '@libs/wcm/hooks/useEvents';
import { useSchemas } from '@transaction/hooks/queries/useSchemas';
import { useDeprecatedAccount } from '@account/hooks/useDeprecatedAccount';
import { PrimaryButton, SecondaryButton } from 'src/theme/buttons';
import { getSdkError } from '@walletconnect/utils';
import { decodeTransaction } from '@transaction/utils';

import Box from 'src/theme/box';
import BlockchainAppDetailsHeader from '@blockchainApplication/explore/components/BlockchainAppDetailsHeader';
import EmptyState from './EmptyState';
import styles from './requestSummary.css';

const getTitle = (key, t) =>
  Object.values(SIGNING_METHODS).find((item) => item.key === key)?.title ?? t('Method not found.');

const defaultToken = { symbol: 'LSK' };

export const rejectLiskRequest = (request) => {
  const { id } = request;

  return formatJsonRpcError(id, getSdkError(ERROR_CASES.USER_REJECTED_METHODS).message);
};

// eslint-disable-next-line max-statements
const RequestSummary = ({ nextStep, history }) => {
  const { t } = useTranslation();
  const { getAccountByAddress } = useAccounts();
  const { events } = useEvents();
  const [request, setRequest] = useState(null);
  const [transaction, setTransaction] = useState(null);
  const [senderAccount, setSenderAccount] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const { sessionRequest } = useSession();
  const metaData = useBlockchainApplicationMeta();
  useDeprecatedAccount(senderAccount);
  useSchemas();

  const sendingChainID = request?.chainId.replace('lisk:', '');
  const tokenData = useAppsMetaTokens({ config: { params: { chainID: sendingChainID } } });

  const approveHandler = () => {
    const moduleCommand = joinModuleAndCommand(transaction);
    const transactionJSON = toTransactionJSON(transaction, request?.request?.params.schema);
    const token = tokenData.data.data.length > 0 ? tokenData.data.data[0] : defaultToken;

    nextStep({
      transactionJSON,
      formProps: {
        composedFees: [
          {
            title: 'Transaction',
            value: `${convertFromBaseDenom(transaction.fee)} ${token.symbol}`,
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
  };

  const rejectHandler = () => {
    rejectLiskRequest(request);
    removeSearchParamsFromUrl(history, ['modal', 'status', 'name', 'action']);
  };

  useEffect(() => {
    const event = events.find((e) => e.name === EVENTS.SESSION_REQUEST);
    if (event?.meta?.params?.request?.params) {
      setRequest({
        id: event.meta.id,
        ...event.meta.params,
      });
    }
  }, []);

  // eslint-disable-next-line max-statements
  useEffect(() => {
    if (request && !transaction) {
      try {
        const { payload, schema } = request.request.params;
        validator.validator.validateSchema(schema);
        const transactionObj = decodeTransaction(Buffer.from(payload, 'hex'), schema);
        setTransaction(transactionObj);
        const address = extractAddressFromPublicKey(transactionObj.senderPublicKey);
        const account = getAccountByAddress(address);
        // @todo if account doesn't exist, we should inform the user that the tx can't be signed
        setSenderAccount({
          pubkey: transactionObj.senderPublicKey,
          address,
          name: account?.metadata?.name,
        });
        setErrorMessage('');
      } catch (error) {
        setErrorMessage(error.message);
      }
    }
  }, [request]);

  if (!sessionRequest || !request) {
    return <EmptyState history={history} />;
  }

  const { icons, name, url } = sessionRequest.peer.metadata;

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

  return (
    <div className={`${styles.wrapper}`}>
      <BlockchainAppDetailsHeader
        headerText={getTitle(request.request.method, t)}
        application={application}
        clipboardCopyItems={clipboardCopyItems}
      />
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
              <span className={styles.invalidTransactionText}>
                {t('Invalid transaction initiated from another application.')}
              </span>
            )}
          </ValueAndLabel>
          {!errorMessage && (
            <ValueAndLabel className={styles.labeledValue} label={t('Signing account')}>
              <AccountRow
                account={{
                  metadata: { name: senderAccount?.name, address: senderAccount?.address },
                }}
                truncate
                onSelect={() => {}}
              />
            </ValueAndLabel>
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
            onClick={approveHandler}
            data-testid="approve-button"
            disabled={!metaData.data || errorMessage}
          >
            {t('Continue')}
          </PrimaryButton>
        </footer>
      </Box>
    </div>
  );
};

export default RequestSummary;
