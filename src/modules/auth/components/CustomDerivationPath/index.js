import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getDerivationPathErrorMessage } from 'src/modules/wallet/utils/account';
import { Input } from 'src/theme';
import { defaultDerivationPath } from 'src/utils/explicitBipKeyDerivation';

const CustomDerivationPath = ({ onChange }) => {
  const { t } = useTranslation();

  const [derivationPath, setDerivationPath] = useState(defaultDerivationPath);
  const derivationPathErrorMessage = useMemo(
    () => getDerivationPathErrorMessage(derivationPath),
    [derivationPath]
  );

  const onPathInputChange = ({ target }) => {
    const value = target.value;

    setDerivationPath(value);
    onChange?.({ derivationPathErrorMessage, derivationPath: value });
  };

  return (
    <fieldset>
      <label htmlFor="custom-derivation-path-input">{t('Custom derivation path')}</label>
      <Input
        id="custom-derivation-path-input"
        size="m"
        name="custom-derivation-path"
        onChange={onPathInputChange}
        value={derivationPath}
        feedback={derivationPathErrorMessage}
        error={!!derivationPathErrorMessage}
      />
    </fieldset>
  );
};

export default React.memo(CustomDerivationPath);
