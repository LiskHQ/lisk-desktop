/* istanbul ignore file */
import React, { useEffect, useMemo, useState } from 'react';

import TxSignatureCollector from '@transaction/components/TxSignatureCollector';
import { useTokensBalance } from 'src/modules/token/fungible/hooks/queries';
import { removeSearchParamsFromUrl } from 'src/utils/searchParams';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import Form from '../VoteForm';
import Summary from '../VoteSummary';
import Status from '../VoteStatus';
import styles from './styles.css';

const VotingQueue = ({ history, processLaunchProtocol }) => {
  const [{ step }, setMultiStepState] = useState({});

// @Todo this is just a place holder pending when dpos constants are integrated by this issue #4502
const dposTokenId = '0'.repeat(16);

const { data: tokens } = useTokensBalance({ config: { params: { tokenID: dposTokenId } } });
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
      className={step?.current === 3 ? styles.confirmModal :styles.modal}
      onChange={setMultiStepState}
    >
      <Form dposToken={token} />
      <Summary />
      <TxSignatureCollector />
      <Status dposToken={token} />
    </MultiStep>
  );
};

export default VotingQueue;
