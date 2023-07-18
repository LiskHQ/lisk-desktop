import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Dialog from '@theme/dialog/dialog';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import ValueAndLabel from 'src/modules/transaction/components/TransactionDetails/valueAndLabel';
import { PrimaryButton, SecondaryButton, TertiaryButton } from 'src/theme/buttons';
import { ACTIONS, EVENTS } from '@libs/wcm/constants/lifeCycle';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import { useEvents } from '@libs/wcm/hooks/useEvents';
import { useSession } from '@libs/wcm/hooks/useSession';
import classNames from 'classnames';
import { useBlockchainApplicationMeta } from '@blockchainApplication/manage/hooks/queries/useBlockchainApplicationMeta';
import { getLogo } from '@token/fungible/utils/helpers';
import Icon from '@theme/Icon';
import BlockchainAppDetailsHeader from '../../../explore/components/BlockchainAppDetailsHeader';
import AccountsSelector from './AccountsSelector';
import styles from './connectionSummary.css';

function ChainListingItem({ app }) {
  const { t } = useTranslation();
  const { chainName, networkType, chainID, logo } = app;
  const name = `${chainName}-${networkType}`;
  const logoUrl = getLogo({ logo });

  return (
    <div className={styles.ChainListingItem}>
      <img
        className={styles.chainLogo}
        height={40}
        width={40}
        src={logoUrl}
        alt={`${chainName}-logo`}
      />
      <div className={styles.textContainer}>
        <h4 className={styles.name}>{name}</h4>
        <span className={styles.chainId}>{t('Chain ID: ') + chainID}</span>
      </div>
    </div>
  );
}
function ChainListing({ chainIds }) {
  const chainIDs = chainIds?.join(',');
  const { data: { data: appMetaData = [] } = {} } = useBlockchainApplicationMeta({
    config: { params: { chainID: chainIDs } },
    options: { enabled: !!chainIDs?.length },
  });

  return (
    <div className={styles.ChainListing}>
      {appMetaData.map((app) => (
        <ChainListingItem key={app.chainID} app={app} />
      ))}
    </div>
  );
}

function CollapsableRow({ label, children }) {
  const [showChildren, toggleShowChildren] = useState(true);

  return (
    <div className={styles.CollapsableRow}>
      <TertiaryButton
        className={classNames(styles.rowHeaderButton, showChildren && styles.marginBottom)}
        onClick={() => toggleShowChildren(!showChildren)}
      >
        <span>{label}</span>
        <Icon
          name="arrowRightInactive"
          className={classNames(styles.arrowIcon, showChildren && styles.showArrowDown)}
        />
      </TertiaryButton>
      {showChildren && children}
    </div>
  );
}

// eslint-disable-next-line max-statements
const ConnectionSummary = () => {
  const history = useHistory();
  const [addresses, setAddresses] = useState([]);
  const { t } = useTranslation();
  const { events } = useEvents();
  const { approve, reject } = useSession();

  // istanbul ignore next
  if (!events.length || events[events.length - 1].name !== EVENTS.SESSION_PROPOSAL) {
    return <div>{t('Connection summary is not ready yet.')}</div>;
  }

  const { proposer, requiredNamespaces, pairingTopic } = events[events.length - 1].meta.params;

  const application = {
    data: {
      name: proposer.metadata.name,
      projectPage: proposer.metadata.url.replace(/\/$/, ''),
      icon: proposer.metadata.icons[0],
    },
  };

  const liskChainIds = requiredNamespaces.lisk.chains.map((chain) => chain.replace(/\D+/g, ''));

  const connectHandler = async () => {
    const result = await approve(addresses);
    addSearchParamsToUrl(history, {
      modal: 'connectionStatus',
      action: ACTIONS.APPROVE,
      status: result.status,
      name: result.data?.params.proposer.metadata.name ?? '',
    });
  };

  const rejectHandler = async () => {
    const result = await reject();
    addSearchParamsToUrl(history, {
      modal: 'connectionSuccess',
      action: ACTIONS.REJECT,
      status: result.status,
      name: result.data?.params?.proposer.metadata.name ?? '',
    });
  };

  return (
    <Dialog
      hasClose
      onCloseIcon={rejectHandler}
      className={classNames(styles.dialogWrapper, grid.row, grid['center-xs'])}
    >
      <BlockchainAppDetailsHeader
        headerText={t('Connect Wallet')}
        className={styles.blockchainAppDetailsHeaderProp}
        application={application}
        clipboardCopyItems={[{ label: t('Connection ID'), value: pairingTopic }]}
      />
      <div className={styles.wrapper}>
        <p className={styles.connectionDescription}>
          {t(
            'This is a request from wallet connect to establish session with Lisk Desktop, please review the following information carefully before approving.'
          )}
        </p>
        <section className={styles.section}>
          <CollapsableRow label={t('Chains connecting')}>
            <ChainListing chainIds={liskChainIds} />
          </CollapsableRow>
        </section>
        <section className={styles.section}>
          <CollapsableRow label={t('Account(s) to use on this application')}>
            <AccountsSelector setAddresses={setAddresses} addresses={addresses} />
          </CollapsableRow>
        </section>
        <section className={`${styles.section} ${styles.permissions}`}>
          <span className={styles.label}>{t('Site permissions')}</span>
          <div className={styles.twoColumn}>
            <ValueAndLabel label={t('Methods')}>
              <div className={`${styles.items} methods`}>
                {requiredNamespaces.lisk.methods.map((method) => (
                  <span key={method} className={classNames(styles.label, styles.colorSlateGray)}>
                    {method}
                  </span>
                ))}
              </div>
            </ValueAndLabel>
            <ValueAndLabel label={t('Events')}>
              <div className={`${styles.items} events`}>
                {requiredNamespaces.lisk.events.length ? (
                  requiredNamespaces.lisk.events.map((event) => (
                    <span key={event} className={styles.label}>
                      {event}
                    </span>
                  ))
                ) : (
                  <span className={styles.label}>-</span>
                )}
              </div>
            </ValueAndLabel>
          </div>
        </section>
        <footer className={styles.section}>
          <SecondaryButton onClick={rejectHandler}>{t('Cancel')}</SecondaryButton>
          <PrimaryButton onClick={connectHandler} disabled={addresses.length === 0}>
            {t('Connect')}
          </PrimaryButton>
        </footer>
      </div>
    </Dialog>
  );
};

export default ConnectionSummary;
