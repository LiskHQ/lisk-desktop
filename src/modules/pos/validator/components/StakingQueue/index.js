/* istanbul ignore file */
import React, { useEffect, useState, useCallback } from 'react';
import TxSignatureCollector from '@transaction/components/TxSignatureCollector';
import { removeSearchParamsFromUrl } from 'src/utils/searchParams';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import Dialog from 'src/theme/dialog/dialog';
import StakeForm from '../StakeForm';
import StakeSummary from '../StakeSummary';
import StakeStatus from '../StakeStatus';
import styles from './styles.css';
import usePosToken from '../../hooks/usePosToken';

const StakingQueue = ({ history, processLaunchProtocol }) => {
  const [isStepTxSignatureCollector, setIsStepTxSignatureCollector] = useState(false);
  const onMultiStepChange = useCallback(({ step: { current } }) => {
    setIsStepTxSignatureCollector([2, 3].includes(current));
  }, []);

  const { token } = usePosToken();

  const closeModal = () => {
    removeSearchParamsFromUrl(history, ['modal'], true);
  };

  useEffect(() => {
    processLaunchProtocol(history.location.search);

    // remove the search params from the url after applying the values to the staking queue
    removeSearchParamsFromUrl(history, ['stake', 'unstake']);
  }, []);

  return (
    <Dialog hasClose size={isStepTxSignatureCollector && 'sm'}>
      <MultiStep
        key="staking-queue"
        finalCallback={closeModal}
        className={styles.modal}
        onChange={onMultiStepChange}
      >
        <StakeForm posToken={token} />
        <StakeSummary />
        <TxSignatureCollector />
        <StakeStatus posToken={token} />
      </MultiStep>
    </Dialog>
  );
};

export default StakingQueue;
