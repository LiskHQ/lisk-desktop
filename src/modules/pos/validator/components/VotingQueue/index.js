/* istanbul ignore file */
import React, { useEffect, useMemo, useState } from 'react';

import TxSignatureCollector from '@transaction/components/TxSignatureCollector';
import { useTokensBalance } from 'src/modules/token/fungible/hooks/queries';
import { removeSearchParamsFromUrl } from 'src/utils/searchParams';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import StakeForm from '../StakeForm';
import Summary from '../VoteSummary';
import Status from '../VoteStatus';
import styles from './styles.css';
import { usePosConstants } from '../../hooks/queries';

const VotingQueue = ({ history, processLaunchProtocol }) => {
  const [{ step }, setMultiStepState] = useState({});

  // @TODO: we need to change the caching time from 5mins to something larger since this is a constant that doesn't frequently change
  const { data: posConstants, isLoading: isGettingPosConstants } = usePosConstants();

  const { data: tokens } = useTokensBalance({
    config: { params: { tokenID: posConstants?.tokenIDDPoS } },
    options: { enabled: !isGettingPosConstants },
  });
  const token = useMemo(() => tokens?.data?.[0] || {}, [tokens]);

  const closeModal = () => {
    removeSearchParamsFromUrl(history, ['modal'], true);
  };

  useEffect(() => {
    processLaunchProtocol(history.location.search);

    // remove the search params from the url after applying the values to the voting queue
    removeSearchParamsFromUrl(history, ['votes', 'unvotes']);
  }, []);

  return (
    <MultiStep
      key="voting-queue"
      finalCallback={closeModal}
      className={step?.current === 3 ? styles.confirmModal : styles.modal}
      onChange={setMultiStepState}
    >
      <StakeForm dposToken={token} />
      <Summary />
      <TxSignatureCollector />
      <Status dposToken={token} />
    </MultiStep>
  );
};

export default VotingQueue;
