import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from 'src/theme';

const CustomDerivationPath = ({ onChange, value, errorMessage }) => {
  const { t } = useTranslation();

  const onPathInputChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <fieldset>
      <label>{t('Custom derivation path')}</label>
      <Input
        size="m"
        name="custom-derivation-path"
        onChange={onPathInputChange}
        value={value}
        feedback={errorMessage}
        error={!!errorMessage}
      />
    </fieldset>
  );
};

export default React.memo(CustomDerivationPath);
