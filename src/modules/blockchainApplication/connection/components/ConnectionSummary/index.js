import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Dialog from '@theme/dialog/dialog';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import ValueAndLabel from 'src/modules/transaction/components/TransactionDetails/valueAndLabel';
import { PrimaryButton, SecondaryButton } from 'src/theme/buttons';
import { EVENTS, ACTIONS } from '@libs/wcm/constants/lifeCycle';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import { useEvents } from '@libs/wcm/hooks/useEvents';
import { useSession } from '@libs/wcm/hooks/useSession';
import classNames from 'classnames';
import BlockchainAppDetailsHeader from '../../../explore/components/BlockchainAppDetailsHeader';
import AccountsSelector from './AccountsSelector';
import styles from './connectionSummary.css';

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
  const nameSpaceKeys = Object.keys(requiredNamespaces);
  const nameSpaceError = nameSpaceKeys.length > 1 || !nameSpaceKeys.includes('lisk');

  const application = {
    data: {
      name: proposer.metadata.name,
      projectPage: proposer.metadata.url.replace(/\/$/, ''),
      icon: proposer.metadata.icons[0],
      address: `Chain ID: ${requiredNamespaces.lisk.chains[0].replace('lisk:', '')}`,
    },
  };

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
      className={classNames(
        styles.dialogWrapper,
        grid.row,
        grid['center-xs'],
        nameSpaceError && styles.dialogError
      )}
    >
      {nameSpaceError ? (
        <div className={classNames(styles.errorWrapper)}>
          <h2 className={classNames(styles.unsupportedDAppTitle)}>{t('Unsupported connection')}</h2>
          <p className={classNames(styles.text)}>
            {t(`You are trying to connect: ${nameSpaceKeys.toString()}`)}
          </p>
          <p className={classNames(styles.text)}>
            {t('Only the lisk dApp can connect to this application')}
          </p>
        </div>
      ) : (
        <>
          <BlockchainAppDetailsHeader application={application} />
          <div className={styles.wrapper}>
            <section className={styles.section}>
              <ValueAndLabel
                className={styles.labeledValue}
                label={t('Account(s) to use on this application')}
              >
                <AccountsSelector setAddresses={setAddresses} addresses={addresses} />
              </ValueAndLabel>
            </section>
            <section className={styles.section}>
              <ValueAndLabel className={styles.labeledValue} label={t('Connection ID')}>
                <span className="pairing-topic">{pairingTopic}</span>
              </ValueAndLabel>
            </section>
            <section className={`${styles.section} ${styles.permissions}`}>
              <span className={styles.label}>{t('Site permissions')}</span>
              <div className={styles.twoColumn}>
                <ValueAndLabel label={t('Methods')}>
                  <div className={`${styles.items} methods`}>
                    {requiredNamespaces.lisk.methods.map((method) => (
                      <span key={method} className={styles.label}>
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
        </>
      )}
    </Dialog>
  );
};

export default ConnectionSummary;
