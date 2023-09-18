/* eslint-disable complexity */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { convertFromBaseDenom } from '@token/fungible/utils/helpers';
import Input from 'src/theme/Input/Input';
import Icon from 'src/theme/Icon';
import Spinner from 'src/theme/Spinner';
import Tooltip from 'src/theme/Tooltip';
import { keyCodes } from 'src/utils/keyCodes';
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
  fees,
  setCustomFee,
  customFee,
  minRequiredBalance,
  computedMinimumFees,
}) => {
  const { t } = useTranslation();
  const [showEditInput, setShowEditInput] = useState({});
  const composedFeeList = fees.filter(({ isHidden }) => !isHidden);

  useEffect(() => {
    composedFeeList.forEach(({ label, token }) => {
      if (!customFee?.value?.[label]) {
        onInputFee((state) => ({
          ...state,
          [label]: convertFromBaseDenom(computedMinimumFees[label], token),
        }));
      }
    });
  }, [computedMinimumFees]);

  const onInputKeyUp = (e, label) => {
    if (e.keyCode !== keyCodes.enter) return;
    setShowEditInput((state) => ({ ...state, [label]: false }));
  };

  const onInputBlur = (e) => {
    e.preventDefault();
    setShowEditInput({}, 100);
    setCustomFee((state) => ({ ...state, error: {}, feedback: {} }));
  };

  const onInputChange = (e, label) => {
    e.preventDefault();
    const customFeeInput = e.target.value;
    const { token } =
      composedFeeList.find((composedFeeValue) => composedFeeValue.label === label) || {};

    const customFeeStatus = getCustomFeeStatus({
      customFeeInput,
      minRequiredBalance,
      token,
      minFee: computedMinimumFees[label],
    });
    const minFeeFromBaseDenom = convertFromBaseDenom(computedMinimumFees[label], token);

    onInputFee((minFees) => ({
      ...minFees,
      [label]: !customFeeStatus ? customFeeInput || minFeeFromBaseDenom : minFeeFromBaseDenom,
    }));

    setCustomFee((state) => ({
      value: {
        ...state.value,
        [label]: !customFeeStatus ? customFeeInput || minFeeFromBaseDenom : minFeeFromBaseDenom,
      },
      feedback: { ...state.feedback, [label]: customFeeStatus },
      error: { ...state.error, [label]: !!customFeeStatus },
    }));
  };

  const onClickCustomEdit = (e, label) => {
    e.preventDefault();
    setShowEditInput(() => ({ [label]: true }));
  };

  if (isLoading) {
    return (
      <span className={styles.loadingWrapper}>
        <span>{t('Loading')}</span>
        <Spinner className={styles.spinner} />
      </span>
    );
  }

  return (
    <div className={styles.feesListWrapper}>
      {composedFeeList.map(({ title, value, components, label }) => (
        <div className={styles.feeRow} key={title}>
          <span>{title}</span>
          <span className={`${styles.value} fee-value-${title}`}>
            {isCustom && showEditInput[label] ? (
              <div className={styles.feeInput}>
                <Input
                  autoFocus
                  className="custom-fee-input"
                  type="text"
                  size="xs"
                  value={feeValue[label]}
                  onChange={(e) => onInputChange(e, label)}
                  onKeyUp={(e) => onInputKeyUp(e, label)}
                  onBlur={onInputBlur}
                  status={customFee?.error?.[label] ? 'error' : 'ok'}
                  feedback={customFee?.feedback?.[label]}
                />
              </div>
            ) : (
              <span>{typeof value === 'object' ? value?.value : value}</span>
            )}
            {isCustom && !showEditInput[label] && (
              <Icon onClick={(e) => onClickCustomEdit(e, label)} name="edit" />
            )}
            {title === 'Transaction' && components.length !== 0 && !isCustom && (
              <Tooltip className={styles.tooltip} position="top left">
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
