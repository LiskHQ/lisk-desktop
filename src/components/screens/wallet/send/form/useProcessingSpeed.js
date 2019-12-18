import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { dynamicFeesRetrieved } from '../../../../../actions/service';

const useProcessingSpeed = (amount, getCalculatedDynamicFee) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const { dynamicFees } = useSelector(state => state.service);
  useEffect(() => {
    dispatch(dynamicFeesRetrieved());
  }, []);

  const [processingSpeedState, setProcessingSpeedState] = useState({
    value: 0,
    isLoading: true,
    txFee: 0,
    selectedIndex: 0,
  });

  const selectProcessingSpeed = ({ item, index }) => {
    setProcessingSpeedState({
      ...processingSpeedState,
      ...item,
      selectedIndex: index,
      isLoading: false,
      txFee: getCalculatedDynamicFee(item.value, amount.value),
    });
  };

  const feeOptions = [
    { title: t('Low'), value: dynamicFees.Low },
    { title: t('High'), value: dynamicFees.High },
  ];

  useEffect(() => {
    selectProcessingSpeed({
      item: {
        ...processingSpeedState,
        ...feeOptions[processingSpeedState.selectedIndex],
      },
      index: processingSpeedState.selectedIndex,
    }, amount);
  }, [dynamicFees, amount]);

  return [processingSpeedState, selectProcessingSpeed, feeOptions];
};

export default useProcessingSpeed;
