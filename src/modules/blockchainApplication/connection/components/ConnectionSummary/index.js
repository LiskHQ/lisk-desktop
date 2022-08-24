import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import ValueAndLabel from 'src/modules/transaction/components/TransactionDetails/valueAndLabel';
import { PrimaryButton, SecondaryButton } from 'src/theme/buttons';
import { EVENTS } from '@libs/wcm/constants/lifeCycle';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import ConnectionContext from '@libs/wcm/context/connectionContext';
import useSession from '@libs/wcm/hooks/useSession';
import { useAccounts } from '@account/hooks';
import BlockchainAppDetailsWrapper from '../../../explore/components/BlockchainAppDetailsWrapper';
import AccountsSelector from './AccountsSelector';
import styles from './connectionSummary.css';

// eslint-disable-next-line max-statements
const ConnectionSummary = ({ history }) => {
  const [addresses, setAddresses] = useState([]);
  const { t } = useTranslation();
  const { accounts } = useAccounts();
  const { events } = useContext(ConnectionContext);
  const { approve, reject } = useSession();

  const connectHandler = async () => {
    const status = await approve(addresses);
    addSearchParamsToUrl(history, { modal: 'connectionSuccess', status });
  };

  const rejectHandler = () => {
    reject();
  };

  if (!events.length || events[events.length - 1].name !== EVENTS.SESSION_PROPOSAL) {
    return <div>{t('Connection summary is not ready yet.')}</div>;
  }

  const { proposer, requiredNamespaces, pairingTopic } = events[events.length - 1].meta.params;
  const application = {
    data: {
      name: proposer.metadata.name,
      serviceUrl: proposer.metadata.url.replace(/\/$/, ''),
      icon: proposer.metadata.icons[0],
      address: `Chain ID: ${requiredNamespaces.lisk.chains[0].replace('lisk:', '')}`,
    },
  };

  return (
    <BlockchainAppDetailsWrapper
      application={application}
    >
      <div className={styles.wrapper}>
        <section className={styles.section}>
          <ValueAndLabel
            className={styles.labeledValue}
            label={t('Select accounts(s) to use on this application')}
          >
            <AccountsSelector
              setAddresses={setAddresses}
              addresses={addresses}
              accounts={accounts}
            />
          </ValueAndLabel>
        </section>
        <section className={styles.section}>
          <ValueAndLabel
            className={styles.labeledValue}
            label={t('Connection ID')}
          >
            <span className="pairing-topic">{pairingTopic}</span>
          </ValueAndLabel>
        </section>
        <section className={`${styles.section} ${styles.permissions}`}>
          <span className={styles.label}>{t('Permissions')}</span>
          <div className={styles.twoColumn}>
            <ValueAndLabel
              label={t('Methods')}
            >
              <div className={`${styles.items} methods`}>
                {
                  requiredNamespaces.lisk.methods.map(
                    method => (<span key={method} className={styles.label}>{method}</span>),
                  )
                }
              </div>
            </ValueAndLabel>
            <ValueAndLabel
              label={t('Events')}
            >
              <div className={`${styles.items} events`}>
                {
                  requiredNamespaces.lisk.events.length
                    ? requiredNamespaces.lisk.events.map(
                      event => (<span key={event} className={styles.label}>{event}</span>),
                    )
                    : <span className={styles.label}>-</span>
                }
              </div>
            </ValueAndLabel>
          </div>
        </section>
        <footer className={styles.section}>
          <SecondaryButton
            onClick={rejectHandler}
          >
            {t('Reject')}
          </SecondaryButton>
          <PrimaryButton
            onClick={connectHandler}
            disabled={addresses.length === 0}
          >
            {t('Connect')}
          </PrimaryButton>
        </footer>
      </div>
    </BlockchainAppDetailsWrapper>
  );
};

export default withRouter(ConnectionSummary);
