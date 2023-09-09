import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { convertFromBaseDenom } from '@token/fungible/utils/helpers';
import Input from 'src/theme/Input/Input';
import Icon from 'src/theme/Icon';
import Spinner from 'src/theme/Spinner';
import Tooltip from 'src/theme/Tooltip';
import { validateAmount } from 'src/utils/validators';
import styles from './TransactionPriority.css';

const getCustomFeeStatus = ({ customFeeInput, minFee, minRequiredBalance, token }) => {
  if (!customFeeInput || !token || !minRequiredBalance) return undefined;

  const { message } = validateAmount({
    amount: customFeeInput.toString(),
    token,
    accountBalance: BigInt(token.availableBalance) - BigInt(minRequiredBalance),
    minValue: minFee,
    checklist: ['FORMAT', 'ZERO', 'MAX_ACCURACY', 'FEE_RANGE'],
  });

  return message;
};

const displayFeeInfo = (feeInfo) => {
  const fullFee = convertFromBaseDenom(feeInfo);
  if (fullFee.slice(-1) === '0') {
    return Number(fullFee).toFixed(0);
  }
  return Number(fullFee).toFixed(6);
};

const FeesBreakdownDetails = ({ type, feeValueInfo, token }) => (
  <>
    <span>{type.replace('Fee', '')}</span>
    <span>
      {displayFeeInfo(feeValueInfo)} {token?.symbol}
    </span>
  </>
);

// eslint-disable-next-line max-statements
const FeesViewer = ({
  isLoading,
  isCustom,
  onInputFee,
  feeValue,
  minFee,
  fees,
  setCustomFee,
  customFee,
  token,
  minRequiredBalance,
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
    const customFeeInput = e.target.value;
    onInputFee(customFeeInput);
    const customFeeStatus = getCustomFeeStatus({
      customFeeInput,
      minFee,
      minRequiredBalance,
      token,
    });
    setCustomFee({
      value: !customFeeStatus ? customFeeInput || minFee : minFee,
      feedback: customFeeStatus,
      error: !!customFeeStatus,
    });
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
        status={
          getCustomFeeStatus({ customFeeInput: feeValue, minFee, minRequiredBalance, token })
            ? 'error'
            : 'ok'
        }
        feedback={customFee?.feedback}
      />
    );
  }

  return (
    <div className={styles.feesListWrapper}>
      {composedFeeList.map(({ title, value, components }) => (
        <div className={styles.feeRow} key={title}>
          <span>{title}</span>
          <span className={`${styles.value} fee-value-${title}`} onClick={onClickCustomEdit}>
            {typeof value === 'object' ? value?.value : value}
            {isCustom && showEditIcon && title === 'Transaction' && <Icon name="edit" />}
            {title === 'Transaction' && (
              <Tooltip position="top left">
                <div className={styles.feesBreakdownRow}>
                  <p>{t('Fee breakdown')}</p>
                  {components.map(({ type, value: feeValueInfo, feeToken }, index) => (
                    <FeesBreakdownDetails
                      key={`${index}-${type}-${feeValueInfo}`}
                      type={type}
                      feeValueInfo={feeValueInfo}
                      token={feeToken}
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
