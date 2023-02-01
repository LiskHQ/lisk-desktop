import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fromRawLsk, toRawLsk } from '@token/fungible/utils/lsk';
import Input from 'src/theme/Input/Input';
import Icon from 'src/theme/Icon';
import Spinner from 'src/theme/Spinner';
import styles from './TransactionPriority.css';

const isCustomFeeValid = (value, maxFee, minFee) => {
  if (!value) return false;
  const rawValue = toRawLsk(parseFloat(value));

  if (rawValue > maxFee) {
    return false;
  }

  return rawValue >= toRawLsk(minFee);
};

// eslint-disable-next-line max-statements
const FeesViewer = ({
  isLoading,
  isCustom,
  onInputFee,
  feeValue,
  maxFee,
  minFee,
  fees,
  setCustomFee,
}) => {
  const { t } = useTranslation();
  const [showEditIcon, setShowEditIcon] = useState(false);
  const composedFeeList = fees.filter(({ isHidden }) => !isHidden);

  const onInputFocus = (e) => {
    e.preventDefault();
    if (!feeValue) onInputFee(minFee);
  };

  const onInputBlur = (e) => {
    e.preventDefault();
    setShowEditIcon(true);
  };

  const onInputChange = (e) => {
    e.preventDefault();
    const newValue = e.target.value;
    onInputFee(newValue);
    if (isCustomFeeValid(newValue, maxFee, minFee)) {
      setCustomFee({ value: newValue, feedback: '', error: false });
    } else {
      setCustomFee({ value: undefined, feedback: 'invalid custom fee', error: true });
    }
  };

  const onClickCustomEdit = (e) => {
    e.preventDefault();
    setShowEditIcon(false);
  };

  if (isLoading) {
    return (
      <span className={styles.loadingWrapper}>
        <span>{t('Loading')}</span>
        <Spinner className={styles.spinner} />
      </span>
    );
  }

  if (isCustom && !showEditIcon) {
    return (
      <Input
        className="custom-fee-input"
        autoFocus
        type="text"
        size="m"
        value={feeValue}
        onChange={onInputChange}
        onBlur={onInputBlur}
        onFocus={onInputFocus}
        status={!isCustomFeeValid(feeValue, maxFee, minFee) ? 'error' : 'ok'}
        feedback={`fee must be between ${minFee} and ${fromRawLsk(maxFee)}`}
      />
    );
  }

  return (
    <div className={styles.feesListWrapper}>
      {composedFeeList.map(({ title, value }) => (
        <div className={styles.feeRow} key={title}>
          <span>{title}</span>
          <span className={`${styles.value} fee-value-${title}`} onClick={onClickCustomEdit}>
            {value}
            {isCustom && showEditIcon && title === 'Transaction' && <Icon name="edit" />}
          </span>
        </div>
      ))}
    </div>
  );
};
export default FeesViewer;
