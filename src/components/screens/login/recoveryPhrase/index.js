import React from 'react';
import { useSelector } from 'react-redux';
import { selectSettings } from '@store/selectors';
import CheckBox from '@toolbox/checkBox';
import { Input } from '@toolbox/inputs';
import styles from './recoveryPhrase.css';

const RecoveryPhrase = ({
  t, derivationPath, setDerivationPath,
  isRecoveryPhraseMode, setIsRecoveryPhrase,
}) => {
  const { showCustomDerivationPath } = useSelector(selectSettings);

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
      {isRecoveryPhraseMode && showCustomDerivationPath && (
        <Input
          className={styles.derivationPathInput}
          size="l"
          onChange={(e) => { setDerivationPath(e.target.value); }}
          value={derivationPath}
        />
      )}
    </>
  );
};

export default React.memo(RecoveryPhrase);
