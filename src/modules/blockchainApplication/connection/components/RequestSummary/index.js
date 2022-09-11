import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConnectionContext from '@libs/wcm/context/connectionContext';
import ValueAndLabel from '@transaction/components/TransactionDetails/valueAndLabel';
import AccountRow from '@account/components/AccountRow';
import { rejectLiskRequest } from '@libs/wcm/utils/requestHandlers';
import { SIGNING_METHODS } from '@libs/wcm/constants/permissions';
import { EVENTS } from '@libs/wcm/constants/lifeCycle';
import { elementTxToDesktopTx, convertTxJSONToBinary } from '@transaction/utils/transaction';
import { joinModuleAndCommandIds } from '@transaction/utils/moduleAssets';
import { Link } from 'react-router-dom';
import Icon from 'src/theme/Icon';
import useSession from '@libs/wcm/hooks/useSession';
import { PrimaryButton, SecondaryButton } from 'src/theme/buttons';
import Box from 'src/theme/box';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './requestSummary.css';

const getTitle = (key, t) =>
  Object.values(SIGNING_METHODS).find(item => item.key === key)?.title
    ?? t('Method not found');

// eslint-disable-next-line max-statements
const RequestSummary = ({ nextStep }) => {
  const { t } = useTranslation();
  const { events } = useContext(ConnectionContext);
  const [request, setRequest] = useState(null);
  const { session } = useSession();

  const approveHandler = () => {
    const tx = request.params.request.params.rawTx;
    const moduleCommandID = joinModuleAndCommandIds({
      moduleID: tx.moduleID,
      commandID: tx.commandID,
    });
    const binaryTx = convertTxJSONToBinary(
      tx, moduleCommandID,
    );
    const rawTx = elementTxToDesktopTx(binaryTx, moduleCommandID);
    nextStep({ rawTx });
  };
  const rejectHandler = () => {
    rejectLiskRequest(request);
  };

  useEffect(() => {
    const event = events.find(e => e.name === EVENTS.SESSION_REQUEST);
    if (event) {
      setRequest(event.meta);
    }
  }, []);

  if (!session.request || !request) {
    return <div />;
  }

  const { icons, name, url } = session.request.peer.metadata;
  const { params: { chainId } } = request;

  return (
    <div className={`${styles.wrapper} ${grid.row} ${grid['center-xs']}`}>
      <div className={styles.avatarContainer}>
        <h2>{getTitle(request.params.request.method, t)}</h2>
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
              account={{ metadata: { name: 'Lisker', address: 'lskj34x8zh85zh4khjq64ofudmjax2hzc5hxw7vok' } }}
              truncate
              onSelect={() => {}}
              showRemove={false}
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
