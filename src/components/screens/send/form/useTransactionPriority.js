import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { getTransactionBaseFees } from '../../../../utils/api/transactions';

const useTransactionPriority = (token) => {
  const { t } = useTranslation();
  const network = useSelector(state => state.network);
  const [error, setError] = useState(false);
  const [baseFees, setBaseFees] = useState({
    Low: 0,
    Medium: 0,
    High: 0,
  });
  const [selectedPriority, setselectedPriority] = useState({
    value: 0,
    selectedIndex: 0,
  });

  useEffect(() => {
    getTransactionBaseFees(token, network)
      .then(setBaseFees)
      .catch(setError);
  }, []);

  const selectTransactionPriority = ({ item, index }) => {
    setselectedPriority({
      ...item,
      selectedIndex: index,
      error: !!error,
    });
  };

  const priorityOptions = [
    { title: t('Low'), value: baseFees.Low },
    { title: t('Medium'), value: baseFees.Medium },
    { title: t('High'), value: baseFees.High },
    { title: t('Custom'), value: baseFees.Low },
  ];

  useEffect(() => {
    selectTransactionPriority({
      item: priorityOptions[selectedPriority.selectedIndex],
      index: selectedPriority.selectedIndex,
    });
  }, [selectedPriority.index, baseFees]);

  return [selectedPriority, selectTransactionPriority, priorityOptions];
};

export default useTransactionPriority;
