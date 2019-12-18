import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { dynamicFeesRetrieved } from '../../../../../actions/service';

const useProcessingSpeed = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const { dynamicFees } = useSelector(state => state.service);
  useEffect(() => {
    dispatch(dynamicFeesRetrieved());
  }, []);
  const isLoading = Object.keys(dynamicFees).length === 0;

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
  }, [dynamicFees]);

  return [processingSpeedState, selectProcessingSpeed, feeOptions];
};

export default useProcessingSpeed;
