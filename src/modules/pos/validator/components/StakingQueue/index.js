/* istanbul ignore file */
import React, { useEffect, useMemo, useState } from 'react';

import TxSignatureCollector from '@transaction/components/TxSignatureCollector';
import { useTokensBalance } from 'src/modules/token/fungible/hooks/queries';
import { removeSearchParamsFromUrl } from 'src/utils/searchParams';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import StakeForm from '../StakeForm';
import StakeSummary from '../StakeSummary';
import StakeStatus from '../StakeStatus';
import styles from './styles.css';
import { usePosConstants } from '../../hooks/queries';

const stepClass = {
  3: styles.confirm,
  2: styles.signatureCollector,
};

const StakingQueue = ({ history, processLaunchProtocol }) => {
  const [{ step }, setMultiStepState] = useState({});

  const { data: posConstants, isLoading: isGettingPosConstants } = usePosConstants();

  const { data: tokens } = useTokensBalance({
    config: { params: { tokenID: posConstants?.posTokenID } },
    options: { enabled: !isGettingPosConstants },
  });
  const token = useMemo(() => tokens?.data?.[0] || {}, [tokens]);

  const closeModal = () => {
    removeSearchParamsFromUrl(history, ['modal'], true);
  };

  useEffect(() => {
    processLaunchProtocol(history.location.search);

    // remove the search params from the url after applying the values to the staking queue
    removeSearchParamsFromUrl(history, ['stake', 'unstake']);
  }, []);

  return (
    <MultiStep
      key="staking-queue"
      finalCallback={closeModal}
      className={stepClass[step?.current] || styles.modal}
      onChange={setMultiStepState}
    >
      <StakeForm posToken={token} />
      <StakeSummary />
      <TxSignatureCollector />
      <StakeStatus posToken={token} />
    </MultiStep>
  );
};

export default StakingQueue;
