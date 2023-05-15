import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from 'src/theme';

const CustomDerivationPath = ({ onChange, derivationPath, derivationPathErrorMessage }) => {
  const { t } = useTranslation();

  return (
    <fieldset>
      <label htmlFor="custom-derivation-path-input">{t('Custom derivation path')}</label>
      <Input
        id="custom-derivation-path-input"
        size="m"
        name="custom-derivation-path"
        onChange={onChange}
        value={derivationPath}
        feedback={derivationPathErrorMessage}
        error={!!derivationPathErrorMessage}
      />
    </fieldset>
  );
};

export default React.memo(CustomDerivationPath);
