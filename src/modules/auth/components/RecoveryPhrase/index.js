import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { settingsUpdated } from 'src/redux/actions';
import { selectSettings } from 'src/redux/selectors';
import { Input } from 'src/theme';
import { defaultDerivationPath } from 'src/utils/explicitBipKeyDerivation';
import styles from '../Signin/login.css';

const RecoveryPhrase = ({ t }) => {
  const { enableCustomDerivationPath, customDerivationPath } = useSelector(selectSettings);
  const dispatch = useDispatch();

  const onPathInputChange = (e) => {
    dispatch(settingsUpdated({ customDerivationPath: e.target.value }));
  };

  if (!enableCustomDerivationPath) {
    return null;
  }

  return (
    <fieldset>
      <label>{t('Custom derivation path')}</label>
      <Input
        className={`${styles.derivationPathInput} custom-derivation-path-input`}
        size="l"
        onChange={onPathInputChange}
        value={customDerivationPath || defaultDerivationPath}
      />
    </fieldset>
  );
};

export default React.memo(RecoveryPhrase);
