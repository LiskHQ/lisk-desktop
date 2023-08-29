import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import Box from 'src/theme/box';
import Dialog from '@theme/dialog/dialog';
import { useBlockchainApplicationMeta } from '@blockchainApplication/manage/hooks/queries/useBlockchainApplicationMeta';
import { PrimaryButton } from 'src/theme/buttons';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import { Input } from 'src/theme';
import { usePairings } from '@libs/wcm/hooks/usePairings';
import { useEvents } from '@libs/wcm/hooks/useEvents';
import { EVENTS, STATUS } from '@libs/wcm/constants/lifeCycle';
import { isValidWCURI } from '@libs/wcm/utils/validator';
import styles from './ConnectionProposal.css';

// eslint-disable-next-line max-statements
const ConnectionProposal = () => {
  const history = useHistory();
  const [wcUri, setWCUri] = useState('');
  const [nameSpaceError, setNameSpaceError] = useState('');
  const [status, setStatus] = useState({});
  const { events } = useEvents();
  const { setUri } = usePairings();
  const { t } = useTranslation();
  const event = events?.length && events[events.length - 1];
  const requiredNamespaces = event?.meta?.params?.requiredNamespaces;
  const requestingChains = (requiredNamespaces?.lisk?.chains || []).join(',').replace(/lisk:/g, '');

  const blockchainAppsMeta = useBlockchainApplicationMeta({
    config: { params: { chainID: requestingChains } },
    options: { enabled: !!requestingChains },
  });

  // eslint-disable-next-line max-statements
  const clickHandler = async () => {
    setNameSpaceError('');
    setStatus({ ...status, isPending: true });

    const isValidWCUri = isValidWCURI(wcUri);

    if (!isValidWCUri) {
      setStatus({ ...status, isPending: false });
      setNameSpaceError('Invalid connection URI.');
      return;
    }

    const result = await setUri(wcUri);
    if (result.status === STATUS.FAILURE) {
      const errorMessage = result.message?.split(':');
      setStatus({ ...status, isPending: false });
      setNameSpaceError(errorMessage?.length ? `${errorMessage[0]}.` : 'Connection failed.');
    } else {
      setStatus(result);
    }
  };

  // eslint-disable-next-line max-statements, complexity
  useEffect(() => {
    // istanbul ignore else
    const cleanUpFn = () => {};

    if (blockchainAppsMeta.isFetching || blockchainAppsMeta.isLoading) return cleanUpFn;

    const nameSpaceKeys = requiredNamespaces && Object.keys(requiredNamespaces);
    const hasNameSpaceError =
      !nameSpaceKeys || nameSpaceKeys.length > 1 || !nameSpaceKeys.includes('lisk');
    const isSessionProposal = event?.name === EVENTS.SESSION_PROPOSAL;

    console.log(
      '----',
      requiredNamespaces,
      !blockchainAppsMeta?.data?.data?.length || blockchainAppsMeta.isError,
      { ...blockchainAppsMeta }
    );

    if (!blockchainAppsMeta?.data?.data?.length || blockchainAppsMeta.isError) {
      setNameSpaceError(t('Connection request contains unsupported chainIDs'));

      return cleanUpFn;
    }

    if (isSessionProposal && hasNameSpaceError) {
      setWCUri(`wc:${event?.meta?.params?.pairingTopic}`);
      setNameSpaceError(t('You are trying to connect to an unsupported blockchain app.'));
    } else if (isSessionProposal) {
      addSearchParamsToUrl(history, { modal: 'connectionSummary' });
    }

    return cleanUpFn;
  }, [events, blockchainAppsMeta.isFetching]);

  const onInputChange = ({ target }) => {
    setNameSpaceError('');
    setWCUri(target.value);
  };

  return (
    <Dialog className={styles.wrapper} hasClose>
      <Box>
        <div className={styles.title}>
          <h3>{t('Connect wallet')}</h3>
          <h6>{t('Enter a URI to connect your wallet to a blockchain application.')}</h6>
        </div>
        <div>
          <div className={styles.inputWrapper}>
            <Input
              type="text"
              onChange={onInputChange}
              value={wcUri}
              className={styles.input}
              isLoading={blockchainAppsMeta.isFetching}
              placeholder={t('Enter connection URI')}
            />
            {nameSpaceError && (
              <span className={styles.feedback}>
                <span className={styles.feedbackErrorColor}>{nameSpaceError}</span>
                <span className={styles.feedbackCorrectionColor}>
                  {' '}
                  {t('Please enter a valid blockchain app URI.')}
                </span>
              </span>
            )}
            <PrimaryButton
              onClick={clickHandler}
              disabled={
                nameSpaceError ||
                wcUri.length === 0 ||
                status.isPending ||
                blockchainAppsMeta.isFetching ||
                blockchainAppsMeta.isError
              }
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
