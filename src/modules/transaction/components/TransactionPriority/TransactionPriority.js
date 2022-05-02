import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { MODULE_ASSETS_MAP } from '@transaction/configuration/moduleAssets';
import { tokenMap } from '@token/configuration/tokens';
import {
  formatAmountBasedOnLocale,
} from '@common/utilities/formattedNumber';
import { toRawLsk, fromRawLsk } from '@token/utilities/lsk';
import Input from 'src/theme/Input/Input';
import Icon from 'src/theme/Icon';
import Tooltip from 'src/theme/Tooltip';
import Spinner from 'src/theme/Spinner';

import styles from './TransactionPriority.css';

const CUSTOM_FEE_INDEX = 3;

const getFeeStatus = ({ fee, token, customFee }) => {
  if (customFee) {
    return customFee;
  }
  return !fee.error
    ? `${formatAmountBasedOnLocale({ value: fee.value })} ${token}`
    : fee.feedback;
};

const getRelevantPriorityOptions = (options, token) =>
  options.filter((_, index) =>
    index !== CUSTOM_FEE_INDEX
  || (index === CUSTOM_FEE_INDEX && token === tokenMap.LSK.key));

const isCustomFeeValid = (value, maxFee, minFee) => {
  if (!value) return false;
  const rawValue = toRawLsk(parseFloat(value));

  if (rawValue > maxFee) {
    return false;
  }

  return rawValue >= toRawLsk(minFee);
};

// eslint-disable-next-line max-statements
const TransactionPriority = ({
  t,
  token,
  moduleAssetId,
  fee,
  minFee,
  customFee,
  setCustomFee,
  priorityOptions,
  selectedPriority,
  setSelectedPriority,
  className,
  loadError,
  isLoading,
}) => {
  const [showEditIcon, setShowEditIcon] = useState(false);
  const [inputValue, setInputValue] = useState();

  let maxFee = 0;
  if (token === tokenMap.LSK.key) {
    maxFee = MODULE_ASSETS_MAP[moduleAssetId].maxFee;
  }

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

  const onInputChange = (e) => {
    e.preventDefault();
    const newValue = e.target.value;
    if (token === tokenMap.LSK.key) {
      setInputValue(newValue);
      if (isCustomFeeValid(newValue, maxFee, minFee)) {
        setCustomFee({ value: newValue, feedback: '', error: false });
      } else {
        setCustomFee({ value: undefined, feedback: 'invalid custom fee', error: true });
      }
    } else {
      setCustomFee(newValue);
    }
  };

  const onInputFocus = (e) => {
    e.preventDefault();
    if (!inputValue) setInputValue(minFee);
  };

  const onInputBlur = (e) => {
    e.preventDefault();
    setShowEditIcon(true);
  };

  const onClickCustomEdit = (e) => {
    e.preventDefault();
    setShowEditIcon(false);
  };

  const tokenRelevantPriorities = useMemo(() =>
    getRelevantPriorityOptions(priorityOptions, token),
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
                disabled={disabled}
              >
                {priority.title}
              </button>
            );
          })}
        </div>
      </div>
      <div className={`${styles.col} ${styles.fee} fee-container`}>
        <span className={`${styles.fieldLabel}`}>
          {t('Transaction fee')}
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
        {
          // eslint-disable-next-line no-nested-ternary
          isLoading ? (
            <span className={styles.loadingWrapper}>
              <span>{t('Loading')}</span>
              <Spinner className={styles.spinner} />
            </span>
          )
            : (isCustom && !showEditIcon ? (
              <Input
                className="custom-fee-input"
                autoFocus
                type="text"
                size="m"
                value={inputValue}
                onChange={onInputChange}
                onBlur={onInputBlur}
                onFocus={onInputFocus}
                status={!isCustomFeeValid(inputValue, maxFee, minFee) ? 'error' : 'ok'}
                feedback={`fee must be between ${minFee} and ${fromRawLsk(maxFee)}`}
              />
            ) : (
              <span className={`${styles.value} fee-value`} onClick={onClickCustomEdit}>
                {getFeeStatus({ fee, token, customFee })}
                {isCustom && showEditIcon && <Icon name="edit" />}
              </span>
            ))
        }
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
  fee: PropTypes.object,
  customFee: PropTypes.number,
  minFee: PropTypes.number,
  moduleAssetId: PropTypes.string,
  className: PropTypes.string,
};

export default TransactionPriority;
