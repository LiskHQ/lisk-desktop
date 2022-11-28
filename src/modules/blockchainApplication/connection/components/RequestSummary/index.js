import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConnectionContext from '@libs/wcm/context/connectionContext';
import ValueAndLabel from '@transaction/components/TransactionDetails/valueAndLabel';
import AccountRow from '@account/components/AccountRow';
import { useAccounts } from '@account/hooks/useAccounts';
import { extractAddressFromPublicKey } from '@wallet/utils/account';
import { rejectLiskRequest } from '@libs/wcm/utils/requestHandlers';
import { SIGNING_METHODS } from '@libs/wcm/constants/permissions';
import { EVENTS } from '@libs/wcm/constants/lifeCycle';
// import { elementTxToDesktopTx } from '@transaction/utils/transaction';
import { decodeTransaction, toTransactionJSON } from '@transaction/utils/encoding';
import { fromRawLsk } from '@token/fungible/utils/lsk';
import { joinModuleAndCommand } from '@transaction/utils/moduleCommand';
import { Link } from 'react-router-dom';
import Icon from 'src/theme/Icon';
import useSession from '@libs/wcm/hooks/useSession';
import { useSchemas } from '@transaction/hooks/queries/useSchemas';
import { useDeprecatedAccount } from '@account/hooks/useDeprecatedAccount';
import { PrimaryButton, SecondaryButton } from 'src/theme/buttons';
import Box from 'src/theme/box';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './requestSummary.css';

const getTitle = (key, t) =>
  Object.values(SIGNING_METHODS).find(item => item.key === key)?.title
    ?? t('Method not found');

const getRequestTransaction = (request) => {
  const { payload, schema } = request.request.params;
  return decodeTransaction(Buffer.from(payload, 'hex'), schema);
};

// eslint-disable-next-line max-statements
const RequestSummary = ({ nextStep }) => {
  const { t } = useTranslation();
  const { getAccountByAddress } = useAccounts();
  const { events } = useContext(ConnectionContext);
  const [request, setRequest] = useState(null);
  const [transaction, setTransaction] = useState(null);
  const [senderAccount, setSenderAccount] = useState(null);
  const { session } = useSession();
  useDeprecatedAccount(senderAccount);
  useSchemas();

  const approveHandler = () => {
    const moduleCommand = joinModuleAndCommand({
      moduleID: transaction.module,
      commandID: transaction.command,
    });
    const rawTx = toTransactionJSON(transaction, moduleCommand);
    // const rawTx = elementTxToDesktopTx(transaction, moduleCommand);
    nextStep({
      rawTx: {
        ...rawTx,
        sendingChain: { chainID: request.chainId.replace('lisk:', '') },
        recipientChain: { chainID: request.recipientChainID },
        // @todo Remove composedFees
        composedFees: {
          transaction: `${fromRawLsk(transaction.fee)} LSK`,
        },
      },
      selectedPriority: { title: 'Normal', selectedIndex: 0, value: 0 },
    });
  };
  const rejectHandler = () => {
    rejectLiskRequest(request);
  };

  useEffect(() => {
    const event = events.find(e => e.name === EVENTS.SESSION_REQUEST);
    if (event?.meta?.params?.request?.params) {
      setRequest(event.meta.params);
    }
  }, []);

  useEffect(() => {
    if (request && !transaction) {
      const tx = getRequestTransaction(request);
      setTransaction(tx);
      const address = extractAddressFromPublicKey(tx.senderPublicKey);
      const account = getAccountByAddress(address);
      // @todo if account doesn't exist, we should inform the user that the tx can't be signed
      setSenderAccount({
        pubkey: account.metadata.pubkey,
        address,
        name: account.metadata.name,
      });
    }
  }, [request]);

  if (!session.request || !request) {
    return <div />;
  }

  const { icons, name, url } = session.request.peer.metadata;
  const { chainId } = request;

  return (
    <div className={`${styles.wrapper} ${grid.row} ${grid['center-xs']}`}>
      <div className={styles.avatarContainer}>
        <h2>{getTitle(request.request.method, t)}</h2>
        <img
          data-testid="logo"
          src={icons[0]}
          className={styles.logo}
        />
      </div>
      <div className={styles.chainNameWrapper}>
        <h3 className="chain-name-text">{name}</h3>
      </div>
      <div className={styles.addressRow}>
        <Link
          target="_blank"
          to={url}
        >
          <Icon name="chainLinkIcon" className={styles.hwWalletIcon} />
          {t(url)}
        </Link>
      </div>
      <div className={styles.chainId}>
        <span>{t('Chain ID:')}</span>
        <span>{chainId.replace('lisk:', '')}</span>
      </div>
      <Box>
        <div className={styles.information}>
          <ValueAndLabel
            className={styles.labeledValue}
            label={t('Information')}
          >
            <span>
              {t('{{name}} is requesting a signature from your Lisk wallet.', { name })}
            </span>
          </ValueAndLabel>
          <ValueAndLabel
            className={styles.labeledValue}
            label={t('Selected account')}
          >
            <AccountRow
              account={{ metadata: { name: senderAccount?.name, address: senderAccount?.address } }}
              truncate
              onSelect={() => {}}
            />
          </ValueAndLabel>
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
          >
            {t('Continue')}
          </PrimaryButton>
        </footer>
      </Box>
    </div>
  );
};

export default RequestSummary;
