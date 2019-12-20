import usePromise from 'react-use-promise';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getDynamicFees } from '../../../../../utils/api/btc/service';

const useProcessingSpeed = () => {
  const { t } = useTranslation();
  const [dynamicFees = {}, error, status] = usePromise(getDynamicFees, []);
  const isLoading = status === 'pending';

  const [processingSpeedState, setProcessingSpeedState] = useState({
    value: 0,
    isLoading,
    selectedIndex: 0,
  });

  const selectProcessingSpeed = ({ item, index }) => {
    setProcessingSpeedState({
      ...processingSpeedState,
      ...item,
      selectedIndex: index,
      isLoading,
      error: !!error,
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
    });
  }, [isLoading]);

  return [processingSpeedState, selectProcessingSpeed, feeOptions];
};

export default useProcessingSpeed;
