import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { getDynamicBaseFees } from '../../../../utils/api/btc/service';

const useProcessingSpeed = () => {
  const { t } = useTranslation();
  const { token } = useSelector(state => state.settings);
  const [error, setError] = useState(false);
  const [baseFees, setBaseFees] = useState({});

  useEffect(() => {
    getDynamicBaseFees(token.active)
      .then(setBaseFees)
      .catch(setError);
  }, []);

  const [processingSpeedState, setProcessingSpeedState] = useState({
    value: 0,
    selectedIndex: 0,
  });

  const selectProcessingSpeed = ({ item, index }) => {
    setProcessingSpeedState({
      ...processingSpeedState,
      ...item,
      selectedIndex: index,
      error: !!error,
    });
  };

  const feeOptions = [
    { title: t('Low'), value: baseFees.Low },
    { title: t('Medium'), value: baseFees.Medium },
    { title: t('High'), value: baseFees.High },
  ];

  useEffect(() => {
    if (processingSpeedState.value) {
      selectProcessingSpeed({
        item: {
          ...processingSpeedState,
          ...feeOptions[processingSpeedState.selectedIndex],
        },
        index: processingSpeedState.selectedIndex,
      });
    }
  }, [processingSpeedState.value]);

  return [processingSpeedState, selectProcessingSpeed, feeOptions];
};

export default useProcessingSpeed;
