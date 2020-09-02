import React, { useState, useMemo } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import styles from './dynamicFee.css';
import { tokenMap } from '../../../constants/tokens';
import Input from '../../toolbox/inputs/input';
import Icon from '../../toolbox/icon';
import Tooltip from '../../toolbox/tooltip/tooltip';
import Spinner from '../../toolbox/spinner';
import {
  formatAmountBasedOnLocale,
} from '../../../utils/formattedNumber';
import { fromRawLsk } from '../../../utils/lsk';

const CUSTOM_FEE_INDEX = 3;

// eslint-disable-next-line max-statements
const DynamicFee = ({
  t,
  token,
  priorities,
  selectedPriority,
  setSelectedPriority,
  fee,
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
    setSelectedPriority({ item: priorities[selectedIndex], index: selectedIndex });
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
    priorities.filter((_, index) =>
      index !== CUSTOM_FEE_INDEX
      || (index === CUSTOM_FEE_INDEX && token === tokenMap.LSK.key)),
  [token, priorities]);

  const isLoading = priorities[0].value === 0;

  const getFeeStatus = () => {
    if (customFee) {
      return customFee;
    }
    return !fee.error
      ? `${formatAmountBasedOnLocale({ value: fee.value })} ${token}`
      : fee.feedback;
  };

  const inputValue = !isLoading && (customFee === 'undefined' ? fee.value : customFee);

  return (
    <div className={`${styles.dynamicFeeWrapper} ${styles.fieldGroup} processing-speed`}>
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
              className={`${styles.feePriority} ${index === selectedPriority ? styles.feePrioritySelected : ''} option-${priority.title}`}
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
                t('Lorem Ipsum...')
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
                defaultValue={fromRawLsk(priorities[0].value)}
                value={inputValue}
                onChange={onInputChange}
                onBlur={onInputBlur}
              />
            ) : (
              <span className={`${styles.fee} fee-value`} onClick={onClickCustomEdit}>
                {getFeeStatus()}
                {isCustom && showEditIcon && <Icon name="edit" />}
              </span>
            ))
        }
      </div>
    </div>
  );
};

DynamicFee.defaultProps = {
  t: k => k,
  priorities: [],
};

DynamicFee.propTypes = {
  t: PropTypes.func.isRequired,
  token: PropTypes.string,
  priorities: PropTypes.array.isRequired,
  selectedPriority: PropTypes.number,
  setSelectedPriority: PropTypes.func,
  fee: PropTypes.number,
};

export default withTranslation()(DynamicFee);
