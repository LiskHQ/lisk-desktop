import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Select from 'src/theme/Select';
import settingConstants from 'src/modules/settings/const/settingConstants';
import useSettings from 'src/modules/settings/hooks/useSettings';
import Piwik from 'src/utils/piwik';

function CurrencySelector() {
  const { t } = useTranslation();
  const { currency, toggleSetting } = useSettings(settingConstants.keys.currency);
  const onChangeCurrency = (value) => {
    Piwik.trackingEvent('Settings', 'button', 'Update settings');
    toggleSetting(value);
    toast(t('Settings saved!'));
  };

  const currencies = useMemo(
    () =>
      settingConstants.currencies.map((currencyName) => ({
        label: currencyName,
        value: currencyName,
      })),
    []
  );

  return (
    <Select
      options={currencies}
      selected={currency || settingConstants.currencies[0]}
      onChange={onChangeCurrency}
      className="currency"
      placeholder="Currency"
    />
  );
}

export default CurrencySelector;
