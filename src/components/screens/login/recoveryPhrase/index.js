import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { settingsUpdated } from '@actions';
import { selectSettings } from '@store/selectors';
import CheckBox from '@toolbox/checkBox';
import { Input } from '@toolbox/inputs';
import { defaultDerivationPath } from '@utils/explicitBipKeyDerivation';
import styles from './recoveryPhrase.css';

const RecoveryPhrase = ({
  t, isRecoveryPhraseMode, setIsRecoveryPhrase,
}) => {
  const { enableCustomDerivationPath, customDerivationPath } = useSelector(selectSettings);
  const dispatch = useDispatch();

  const onPathInputChange = (e) => {
    dispatch(settingsUpdated({ customDerivationPath: e.target.value }));
  };

  return (
    <>
      <div className={styles.checkboxWrapper}>
        <CheckBox
          name="recoveryMode"
          className="recovery-phrase-check"
          checked={isRecoveryPhraseMode}
          onChange={() => {
            setIsRecoveryPhrase(!isRecoveryPhraseMode);
          }}
        />
        <span>{t('Enable recovery phrase mode (optional)')}</span>
      </div>
      {isRecoveryPhraseMode && enableCustomDerivationPath && (
        <Input
          className={styles.derivationPathInput}
          size="l"
          onChange={onPathInputChange}
          value={customDerivationPath || defaultDerivationPath}
        />
      )}
    </>
  );
};

export default React.memo(RecoveryPhrase);
