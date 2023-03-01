/* istanbul ignore file */
/* eslint-disable max-statements */
import React, { useMemo, useState } from 'react';
import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import { MIN_ACCOUNT_BALANCE } from '@transaction/configuration/transactions';
import { toRawLsk } from '@token/fungible/utils/lsk';
import { normalizeStakesForTx } from '@transaction/utils';
import BoxContent from '@theme/box/content';
import Dialog from 'src/theme/dialog/dialog';
import TxComposer from '@transaction/components/TxComposer';
import Table from '@theme/table';
import { STAKE_LIMIT } from '../../consts';
import StakeRow from './StakeRow';
import EmptyState from './EmptyState';
import header from './tableHeader';
import styles from './stakeForm.css';

/**
 * Determines the number of stakes that have been
 * added, removed, or edited.
 *
 * @param {Object} stakes - stakes object retrieved from the Redux store
 * @param {Object} account - account object
 * @returns {Object} - stats object
 */
const getStakeStats = (stakes, account) => {
  const stakesStats = Object.keys(stakes).reduce(
    // eslint-disable-next-line max-statements
    (stats, address) => {
      const { confirmed, unconfirmed, username } = stakes[address];

      if (confirmed === 0 && unconfirmed === 0) {
        return stats;
      }

      if (!confirmed && unconfirmed) {
        // new stake
        stats.added[address] = { unconfirmed, username };
      } else if (confirmed && !unconfirmed) {
        // removed stake
        stats.removed[address] = { confirmed, username };
        if (address === account.summary?.address) {
          stats.selfUnStake = { confirmed, username };
        }
      } else if (confirmed !== unconfirmed) {
        // edited stake
        stats.edited[address] = { unconfirmed, confirmed, username };
      } else {
        // untouched
        stats.untouched[address] = { unconfirmed, confirmed, username };
      }
      return stats;
    },
    {
      added: {},
      edited: {},
      removed: {},
      untouched: {},
      selfUnStake: {},
    }
  );

  const numOfAddedStakes = Object.keys(stakesStats.added).length;
  const numOfEditedStakes = Object.keys(stakesStats.edited).length;
  const numOfUntouchedStakes = Object.keys(stakesStats.untouched).length;
  const numOfRemovedStakes = Object.keys(stakesStats.removed).length;

  const resultingNumOfStakes = numOfAddedStakes + numOfEditedStakes + numOfUntouchedStakes;
  const availableStakes = STAKE_LIMIT - (numOfEditedStakes + numOfUntouchedStakes + numOfRemovedStakes + numOfAddedStakes);

  return {
    ...stakesStats,
    resultingNumOfStakes,
    availableStakes,
  };
};

/**
 * Validates given stakes against the following criteria:
 * - Number of stakes must not exceed STAKE_LIMIT
 * - Added stake amounts + fee must not exceed account balance
 * @param {Object} Stakes - stakes object from Redux store
 * @param {Number} balance - Account balance in Beddows
 * @param {Number} fee - Tx fee in Beddows
 * @param {Number} resultingNumOfStakes - Number of used stakes that will result after submitting tx
 * @param {Function} t - i18n translation function
 * @returns {Object} The feedback object including error status and messages
 */
// eslint-disable-next-line max-statements
const validateStakes = (stakes, balance, fee, resultingNumOfStakes, t, posToken) => {
  const messages = [];
  const areStakesInValid = Object.values(stakes).some(
    (stake) => stake.unconfirmed === '' || stake.unconfirmed === undefined
  );

  if (areStakesInValid) {
    messages.push(t('Please enter the stake amounts for the validators you wish to stake for'));
  }

  if (resultingNumOfStakes > STAKE_LIMIT) {
    messages.push(
      t(
        `These stakes in addition to your current stakes will add up to ${resultingNumOfStakes}, exceeding the account limit of ${STAKE_LIMIT}.`
      )
    );
  }

  const addedStakeAmount = Object.values(stakes)
    .filter((stake) => stake.unconfirmed > stake.confirmed)
    .reduce((sum, stake) => {
      sum += stake.unconfirmed - stake.confirmed;
      return sum;
    }, 0);

  if (addedStakeAmount + toRawLsk(fee) > balance) {
    messages.push(t(`You don't have enough ${posToken.symbol} in your account.`));
  }

  if (balance - addedStakeAmount < MIN_ACCOUNT_BALANCE && balance - addedStakeAmount) {
    messages.push(
      `The stake amounts are too high. You should keep 0.05 ${posToken.symbol} available in your account.`
    );
  }

  return { messages, error: !!messages.length };
};

const StakeForm = ({ t, stakes, account, isStakingTxPending, nextStep, history, posToken }) => {
  const [fee, setFee] = useState(0);
  const changedStakes = Object.keys(stakes)
    .filter((address) => stakes[address].unconfirmed !== stakes[address].confirmed)
    .map((address) => ({ address, ...stakes[address] }));

  const normalizedStakes = useMemo(() => normalizeStakesForTx(stakes), [stakes]);
  const { added, edited, removed, selfUnStake, resultingNumOfStakes, availableStakes } = useMemo(
    () => getStakeStats(stakes, account),
    [stakes, account]
  );

  const feedback = validateStakes(
    stakes,
    Number(posToken?.availableBalance),
    fee,
    resultingNumOfStakes,
    t,
    posToken
  );

  const onConfirm = (formProps, transactionJSON, selectedPriority, fees) => {
    nextStep({
      formProps,
      transactionJSON,
      added,
      edited,
      removed,
      selfUnStake,
      selectedPriority,
      fees,
    });
  };

  const onComposed = (rawTx) => {
    setFee(rawTx.fee);
  };

  const showEmptyState = !changedStakes.length || isStakingTxPending;
  const stakeFormProps = {
    moduleCommand: MODULE_COMMANDS_NAME_MAP.stake,
    isFormValid: !feedback.error && Object.keys(changedStakes).length > 0 && !isStakingTxPending,
    fields: {
      token: posToken
    }
  };
  const commandParams = {
    stakes: normalizedStakes,
  };

  return (
    <Dialog hasClose className={`${styles.wrapper}`}>
      <TxComposer
        onComposed={onComposed}
        onConfirm={onConfirm}
        formProps={stakeFormProps}
        commandParams={commandParams}
      >
        <>
          {showEmptyState ? (
            <EmptyState t={t} />
          ) : (
            <>
              <BoxContent className={styles.container}>
                <header className={styles.headerContainer}>
                  <span className={styles.title}>{t('Staking queue')}</span>
                  <div className={styles.stakesAvailableCounter}>
                    <span className="available-stakes-num">{`${availableStakes}/`}</span>
                    <span>
                      {t('{{STAKE_LIMIT}} staking slots available for your account', {
                        STAKE_LIMIT,
                      })}
                    </span>
                  </div>
                </header>
                <div className={styles.contentScrollable}>
                  <Table
                    showHeader
                    data={changedStakes}
                    header={header(t)}
                    row={StakeRow}
                    iterationKey="address"
                    canLoadMore={false}
                    additionalRowProps={{
                      history,
                    }}
                    headerClassName={styles.tableHeader}
                  />
                </div>
              </BoxContent>
              {feedback.error && (
                <div className={`${styles.feedback} feedback`}>
                  <span>{feedback.messages[0]}</span>
                </div>
              )}
            </>
          )}
        </>
      </TxComposer>
    </Dialog>
  );
};

export default StakeForm;
