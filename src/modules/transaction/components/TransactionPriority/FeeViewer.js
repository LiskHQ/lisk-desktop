import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { convertFromBaseDenom, convertToBaseDenom } from '@token/fungible/utils/helpers';
import Input from 'src/theme/Input/Input';
import Icon from 'src/theme/Icon';
import Spinner from 'src/theme/Spinner';
import Tooltip from 'src/theme/Tooltip';
import styles from './TransactionPriority.css';

const isCustomFeeValid = (value, maxFee, minFee, token) => {
  if (!value) return false;
  const rawValue = convertToBaseDenom(parseFloat(value), token);

  if (rawValue > maxFee) {
    return false;
  }

  return rawValue >= convertToBaseDenom(minFee, token);
};

const displayFeeInfo = (feeInfo) => {
  console.log({ res: convertFromBaseDenom(10000000) });
  const fullFee = convertFromBaseDenom(feeInfo);
  if (fullFee.slice(-1) === 0) {
    return Number(fullFee);
  }
  return Number(fullFee).toFixed(6);
};

const FeesBreakdownDetails = ({ type, feeValueInfo, token }) => (
  <>
    <span>{type.replace('Fee', '')}</span>
    <span>
      {displayFeeInfo(feeValueInfo)} {token.symbol}
    </span>
  </>
);

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
  token,
}) => {
  const { t } = useTranslation();
  const [showEditIcon, setShowEditIcon] = useState(false);
  const composedFeeList = fees.filter(({ isHidden }) => !isHidden);
  const transactionFeeList = composedFeeList.find(
    ({ title }) => title === 'Transaction'
  )?.components;

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
    if (isCustomFeeValid(newValue, maxFee, minFee, token)) {
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
        status={!isCustomFeeValid(feeValue, maxFee, minFee, token) ? 'error' : 'ok'}
        feedback={`fee must be between ${minFee} and ${convertFromBaseDenom(maxFee, token)}`}
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
            {title === 'Transaction' && (
              <Tooltip position="top left">
                <div className={styles.feesBreakdownRow}>
                  <p>Fee breakdown</p>
                  {transactionFeeList.map(({ type, value: feeValueInfo }, index) => (
                    <FeesBreakdownDetails
                      key={`${index}-${type}-${feeValueInfo}`}
                      type={type}
                      feeValueInfo={feeValueInfo}
                      token={token}
                    />
                  ))}
                </div>
              </Tooltip>
            )}
          </span>
        </div>
      ))}
    </div>
  );
};

export default FeesViewer;
