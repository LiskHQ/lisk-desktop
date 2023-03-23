import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import Box from 'src/theme/box';
import Dialog from '@theme/dialog/dialog';
import { PrimaryButton } from 'src/theme/buttons';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import { Input } from 'src/theme';
import { usePairings } from '@libs/wcm/hooks/usePairings';
import ConnectionContext from '@libs/wcm/context/connectionContext';
import { EVENTS } from '@libs/wcm/constants/lifeCycle';
import styles from './ConnectionProposal.css';

const ConnectionProposal = ({ history }) => {
  const [value, setValue] = useState('');
  const [status, setStatus] = useState({});
  const { events } = useContext(ConnectionContext);
  const { setUri } = usePairings();
  const { t } = useTranslation();

  const clickHandler = async () => {
    setStatus({ ...status, isPending: true });
    const result = await setUri(value);
    setStatus(result);
  };

  useEffect(() => {
    // istanbul ignore else
    if (events.length && events[events.length - 1].name === EVENTS.SESSION_PROPOSAL) {
      addSearchParamsToUrl(history, { modal: 'connectionSummary' });
    }
  }, [events]);

  return (
    <Dialog className={styles.wrapper} hasClose>
      <Box>
        <div className={styles.title}>
          <h3>{t('Connect wallet')}</h3>
          <h6>{t('Paste WalletConnect URI to connect your application to Lisk Desktop.')}</h6>
        </div>
        <div>
          <div>
            <Input
              type="text"
              onChange={e => setValue(e.target.value)}
              value={value}
              className={styles.input}
              placeholder={t('Enter connection URI')}
            />
            <span className={styles.feedback}>
              {status.message ?? ''}
            </span>
            <PrimaryButton
              onClick={clickHandler}
              disabled={value.length === 0 || status.isPending}
            >
              {t('Connect')}
            </PrimaryButton>
          </div>
        </div>
      </Box>
    </Dialog>
  );
};

export default withRouter(ConnectionProposal);
