import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getTransactionBaseFees } from '../api';

// eslint-disable-next-line max-statements
const useTransactionPriority = () => {
  const { t } = useTranslation();
  const network = useSelector((state) => state.network);
  const [prioritiesLoadError, setPrioritiesLoadError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [baseFees, setBaseFees] = useState({
    Low: 0,
    Medium: 0,
    High: 0,
  });
  const [selectedPriority, setSelectedPriority] = useState({
    value: 0,
    selectedIndex: 0,
  });

  useEffect(() => {
    setLoading(true);
    getTransactionBaseFees(network)
      .then(setBaseFees)
      .catch(setPrioritiesLoadError)
      .finally(() => setLoading(false));
  }, []);

  const selectTransactionPriority = ({ item, index }) => {
    setSelectedPriority({
      ...item,
      selectedIndex: index,
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
  }, [selectedPriority?.value, baseFees.Low, baseFees.Medium, baseFees.High]);

  return [
    selectedPriority,
    selectTransactionPriority,
    priorityOptions,
    prioritiesLoadError,
    loading,
  ];
};

export default useTransactionPriority;
