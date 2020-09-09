import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import styles from './transactionPriority.css';
import { tokenMap } from '../../../constants/tokens';
import Input from '../../toolbox/inputs/input';
import Icon from '../../toolbox/icon';
import Tooltip from '../../toolbox/tooltip/tooltip';
import Spinner from '../../toolbox/spinner';
import {
  formatAmountBasedOnLocale,
} from '../../../utils/formattedNumber';

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

// eslint-disable-next-line max-statements
const TransactionPriority = ({
  t,
  token,
  priorityOptions,
  selectedPriority,
  setSelectedPriority,
  fee,
  minFee,
  customFee,
  setCustomFee,
}) => {
  const [showEditIcon, setShowEditIcon] = useState(false);
  const isCustom = selectedPriority === CUSTOM_FEE_INDEX;

  const onClickPriority = (e) => {
    e.preventDefault();
    if (setCustomFee) {
      setCustomFee(undefined);
    }
    const selectedIndex = Number(e.target.value);
    setSelectedPriority({ item: priorityOptions[selectedIndex], index: selectedIndex });
    if (showEditIcon) {
      setShowEditIcon(false);
    }
  };

  const onInputChange = (e) => {
    e.preventDefault();
    const customFeeValue = e.target.value;
    setCustomFee(customFeeValue);
  };

  const onInputBlur = (e) => {
    e.preventDefault();
    setCustomFee(e.target.value);
    setShowEditIcon(true);
  };

  const onClickCustomEdit = (e) => {
    e.preventDefault();
    setShowEditIcon(false);
  };

  const tokenRelevantPriorities = useMemo(() =>
    getRelevantPriorityOptions(priorityOptions, token),
  [priorityOptions, token]);

  const isLoading = priorityOptions[0].value === 0;
  const inputValue = !isLoading && (customFee === 'undefined' ? fee.value : customFee);

  return (
    <div className={`${styles.wrapper} ${styles.fieldGroup} transaction-priority`}>
      <div className={`${styles.col}`}>
        <span className={`${styles.fieldLabel}`}>
          {t('Priority')}
          <Tooltip>
            <p className={styles.tooltipText}>
              {
                t('When the network is busy, transactions with higher priority get processed sooner.')
              }
            </p>
          </Tooltip>
        </span>
        <div className={`${styles.prioritySelector} priority-selector`}>
          {tokenRelevantPriorities.map((priority, index) => (
            <button
              key={`fee-priority-${index}`}
              className={`${styles.priorityTitle} ${index === selectedPriority ? styles.priorityTitleSelected : ''} option-${priority.title}`}
              onClick={onClickPriority}
              value={index}
            >
              {priority.title}
            </button>
          ))}
        </div>
      </div>
      <div className={`${styles.col} fee-container`}>
        <span className={`${styles.fieldLabel}`}>
          {t('Transaction fee')}
          <Tooltip>
            <p className={styles.tooltipText}>
              {
                t(`
                  You can choose a high, medium, or low transaction priority, each requiring a 
                  corresponding transaction fee. Or you can pay any desired fee of no less than 
                  ${minFee} ${token}. If you don't know which to choose, we recommend you choose 
                  one of the provided options instead.
                `)
              }
            </p>
          </Tooltip>
        </span>
        {
          // eslint-disable-next-line no-nested-ternary
          isLoading ? (
            <>
              {t('Loading')}
              {' '}
              <Spinner className={styles.loading} />
            </>
          )
            : (isCustom && !showEditIcon ? (
              <Input
                className="custom-fee-input"
                autoFocus
                type="text"
                size="m"
                defaultValue={minFee}
                value={inputValue}
                onChange={onInputChange}
                onBlur={onInputBlur}
              />
            ) : (
              <span className={`${styles.feeValue} fee-value`} onClick={onClickCustomEdit}>
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
  fee: PropTypes.number,
  minFee: PropTypes.number,
};

export default TransactionPriority;
