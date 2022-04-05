import React from 'react';
import { toast } from 'react-toastify';
import Select from '@basics/inputs/select';
import settingConstants from '@settings/configuration/settingConstants';
import useSettings from '@settings/managers/useSettings';
import Piwik from '@common/utilities/piwik';

function CurrencySelector({ t }) {
  const { currency, toggleSetting } = useSettings(
    settingConstants.keys.currency,
  );
  const onChangeCurrency = (value) => {
    Piwik.trackingEvent('Settings', 'button', 'Update settings');
    toggleSetting(value);
    toast(t('Settings saved!'));
  };

  return (
    <Select
      options={settingConstants.currencies.map((currencyName) => ({
        label: currencyName,
        value: currencyName,
      }))}
      selected={currency || settingConstants.currencies[0]}
      onChange={onChangeCurrency}
      className="currency"
      placeholder="Currency"
    />
  );
}

export default CurrencySelector;
