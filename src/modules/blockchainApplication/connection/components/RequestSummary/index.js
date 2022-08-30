import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConnectionContext from '@libs/wcm/context/connectionContext';
import ValueAndLabel from '@transaction/components/TransactionDetails/valueAndLabel';
import AccountRow from '@account/components/AccountRow';
import { approveLiskRequest, rejectLiskRequest } from '@libs/wcm/utils/requestHandlers';
import { EVENTS } from '@libs/wcm/constants/lifeCycle';
import { Link } from 'react-router-dom';
import Icon from 'src/theme/Icon';
import useSession from '@libs/wcm/hooks/useSession';
import { PrimaryButton, SecondaryButton } from 'src/theme/buttons';
import Box from 'src/theme/box';
import Dialog from '@theme/dialog/dialog';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './requestSummary.css';

// eslint-disable-next-line max-statements
const RequestSummary = () => {
  const { t } = useTranslation();
  const { events } = useContext(ConnectionContext);
  const [request, setRequest] = useState(null);
  const { session } = useSession();

  const approveHandler = () => {
    approveLiskRequest(request, request.params.request.params.address);
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
    <Dialog hasClose className={`${styles.dialogWrapper} ${grid.row} ${grid['center-xs']}`}>
      <div className={styles.wrapper}>
        <div className={styles.avatarContainer}>
          <h2>{request.params.request.method}</h2>
          <img src={icons[0]} className={styles.logo} />
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
            >
              {t('Cancel')}
            </SecondaryButton>
            <PrimaryButton
              className={styles.button}
              onClick={approveHandler}
            >
              {t('Continue')}
            </PrimaryButton>
          </footer>
        </Box>
      </div>
    </Dialog>
  );
};

export default RequestSummary;
