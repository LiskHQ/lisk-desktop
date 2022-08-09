import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { MODULE_ASSETS_MAP } from '@transaction/configuration/moduleAssets';
import Tooltip from 'src/theme/Tooltip';
import styles from './TransactionPriority.css';
import FeesViewer from './FeeViewer';

const CUSTOM_FEE_INDEX = 3;

const getRelevantPriorityOptions = (options) =>
  options.filter((_, index) =>
    index !== CUSTOM_FEE_INDEX
  || (index === CUSTOM_FEE_INDEX));

// eslint-disable-next-line max-statements
const TransactionPriority = ({
  t,
  token,
  moduleAssetId,
  minFee,
  setCustomFee,
  priorityOptions,
  selectedPriority,
  setSelectedPriority,
  className,
  loadError,
  isLoading,
  composedFees,
}) => {
  const [showEditIcon, setShowEditIcon] = useState(false);
  const [inputValue, setInputValue] = useState();

  const maxFee = MODULE_ASSETS_MAP[moduleAssetId].maxFee;

  const onClickPriority = (e) => {
    e.preventDefault();
    const selectedIndex = Number(e.target.value);
    if (setCustomFee && selectedIndex !== CUSTOM_FEE_INDEX) {
      setCustomFee(undefined);
      setInputValue(undefined);
    }
    setSelectedPriority({ item: priorityOptions[selectedIndex], index: selectedIndex });
    if (showEditIcon) {
      setShowEditIcon(false);
    }
  };

  const tokenRelevantPriorities = useMemo(() =>
    getRelevantPriorityOptions(priorityOptions),
  [priorityOptions, token]);

  const isCustom = selectedPriority === CUSTOM_FEE_INDEX;

  return (
    <div className={`${styles.wrapper} ${styles.fieldGroup} ${className} transaction-priority`}>
      <div className={`${styles.col}`}>
        <span className={`${styles.fieldLabel}`}>
          {t('Priority')}
          <Tooltip position="right">
            <p className={styles.tooltipText}>
              {
                t('When the network is busy, transactions with a higher priority are confirmed sooner.')
              }
            </p>
          </Tooltip>
        </span>
        <div className={`${styles.prioritySelector} priority-selector`}>
          {tokenRelevantPriorities.map((priority, index) => {
            let disabled = false;
            if (index === 0) {
              priority.title = priority.value === 0 ? 'Normal' : 'Low';
            } else if (index === 3) {
              // Custom fee option
              disabled = priority.value === 0 && !loadError;
            } else {
              // Medium and high fee option
              disabled = priority.value === 0 || loadError;
            }

            return (
              <button
                key={`fee-priority-${index}`}
                className={`${styles.priorityTitle} ${index === selectedPriority ? styles.priorityTitleSelected : ''} option-${priority.title}`}
                onClick={onClickPriority}
                value={index}
                disabled={false && disabled}
              >
                {priority.title}
              </button>
            );
          })}
        </div>
      </div>
      <div className={`${styles.col} ${styles.fee} fee-container`}>
        <span className={`${styles.fieldLabel}`}>
          {t('Fees')}
          {
            tokenRelevantPriorities.some(item => item.value !== 0) ? (
              <Tooltip position="left">
                <p className={styles.tooltipText}>
                  {
                    t(`
                      You can choose a high, medium, or low transaction priority, each requiring a
                      corresponding transaction fee. Or you can pay any desired fee of no less than
                      {{minFee}} {{token}}. If you don't know what fee to pay, choose
                      one of the provided transaction priorities.
                    `, { minFee, token })
                  }
                </p>
              </Tooltip>
            ) : null
          }
        </span>
        <FeesViewer
          isLoading={isLoading}
          isCustom={isCustom}
          onInputFee={setInputValue}
          feeValue={inputValue}
          maxFee={maxFee}
          minFee={minFee}
          fees={composedFees}
        />
      </div>
    </div>
  );
};

TransactionPriority.defaultProps = {
  t: k => k,
  priorityOptions: [],
};

TransactionPriority.propTypes = {
  t: PropTypes.func.isRequired,
  token: PropTypes.string,
  priorityOptions: PropTypes.array.isRequired,
  selectedPriority: PropTypes.number,
  setSelectedPriority: PropTypes.func,
  minFee: PropTypes.number,
  moduleAssetId: PropTypes.string,
  className: PropTypes.string,
};

export default TransactionPriority;
