import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import Box from 'src/theme/box';
import Dialog from '@theme/dialog/dialog';
import { PrimaryButton } from 'src/theme/buttons';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import { Input } from 'src/theme';
import { usePairings } from '@libs/wcm/hooks/usePairings';
import { useEvents } from '@libs/wcm/hooks/useEvents';
import { EVENTS, STATUS } from '@libs/wcm/constants/lifeCycle';
import styles from './ConnectionProposal.css';

// eslint-disable-next-line max-statements
const ConnectionProposal = () => {
  const history = useHistory();
  const [value, setValue] = useState('');
  const [nameSpaceError, setNameSpaceError] = useState('');
  const [status, setStatus] = useState({});
  const { events } = useEvents();
  const { setUri } = usePairings();
  const { t } = useTranslation();

  const clickHandler = async () => {
    setNameSpaceError('');
    setStatus({ ...status, isPending: true });

    const result = await setUri(value);
    if (result.status === STATUS.FAILURE) {
      setStatus({ ...status, isPending: false });
      setNameSpaceError('Connection failed');
    } else {
      setStatus(result);
    }
  };

  useEffect(() => {
    // istanbul ignore else
    const event = events?.length && events[events.length - 1];
    const requiredNamespaces = event?.meta?.params?.requiredNamespaces;
    const nameSpaceKeys = requiredNamespaces && Object.keys(requiredNamespaces);
    const hasNameSpaceError =
      !nameSpaceKeys || nameSpaceKeys.length > 1 || !nameSpaceKeys.includes('lisk');
    const isSesssionProposal = event?.name === EVENTS.SESSION_PROPOSAL;

    if (isSesssionProposal && hasNameSpaceError) {
      setValue(`wc:${event?.meta?.params?.pairingTopic}`);
      setNameSpaceError(t('You are trying to connect to an unsupported dApp.'));
    } else if (isSesssionProposal) {
      addSearchParamsToUrl(history, { modal: 'connectionSummary' });
    }
  }, [events]);

  const onInputChange = (event) => {
    setNameSpaceError('');
    setValue(event.target.value);
  };

  return (
    <Dialog className={styles.wrapper} hasClose>
      <Box>
        <div className={styles.title}>
          <h3>{t('Connect wallet')}</h3>
          <h6>{t('Enter a URI to connect your wallet to a blockchain application.')}</h6>
        </div>
        <div>
          <div>
            <Input
              type="text"
              onChange={onInputChange}
              value={value}
              className={styles.input}
              placeholder={t('Enter connection URI')}
            />
            {nameSpaceError && (
              <span className={styles.feedback}>
                <span className={styles.feedbackErrorColor}>{nameSpaceError}</span>
                <span> {t('Please enter a supported dApp URI')}</span>
              </span>
            )}
            <PrimaryButton
              onClick={clickHandler}
              disabled={nameSpaceError || value.length === 0 || status.isPending}
            >
              {t('Connect')}
            </PrimaryButton>
          </div>
        </div>
      </Box>
    </Dialog>
  );
};

export default ConnectionProposal;
