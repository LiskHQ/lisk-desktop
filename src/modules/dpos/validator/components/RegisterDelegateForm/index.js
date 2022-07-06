import React from 'react';
import { useTranslation } from 'react-i18next';
import { MODULE_ASSETS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import { Input } from 'src/theme';
import TxComposer from '@transaction/components/TxComposer';
import useDelegateName from '../../hooks/useDelegateName';
import useDelegateKey from '../../hooks/useDelegateKey';
import InputLabel from './InputLabel';
import styles from './form.css';

const RegisterDelegateForm = ({
  nextStep,
  prevState,
}) => {
  const { t } = useTranslation();
  const [name, setName] = useDelegateName(prevState?.rawTx?.asset.username);
  const [generatorPublicKey, blsPublicKey, proofOfPossession, setKey] = useDelegateKey(
    prevState?.rawTx?.asset.generatorPublicKey,
    prevState?.rawTx?.asset.blsPublicKey,
    prevState?.rawTx?.asset.proofOfPossession,
  );

  const onConfirm = (rawTx) => {
    nextStep({ rawTx });
  };

  const onChangeUsername = ({ target: { value } }) => {
    setName({
      ...name,
      value,
    });
  };

  const onKeyChange = ({ target }) => {
    setKey(target.name, target.value);
  };

  const transaction = {
    moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.registerDelegate,
    asset: {
      username: name.value,
      blsPublicKey,
      generatorPublicKey,
      proofOfPossession,
    },
    isValid: !(name.error || name.loading),
  };

  return (
    <section className={styles.wrapper}>
      <TxComposer
        onConfirm={onConfirm}
        transaction={transaction}
      >
        <>
          <BoxHeader className={styles.header}>
            <h2>{t('Register delegate')}</h2>
          </BoxHeader>
          <BoxContent className={`${styles.container} select-name-container`}>
            <InputLabel field="name" />
            <div className={styles.inputContainer}>
              <Input
                data-name="delegate-username"
                autoComplete="off"
                onChange={onChangeUsername}
                name="delegate-username"
                value={name.value}
                placeholder={t('e.g. peter_pan')}
                className={`${styles.input} select-name-input`}
                error={name.error && name.value.length}
                isLoading={name.loading}
                status={name.error && name.value.length ? 'error' : 'ok'}
                feedback={name.message}
              />
            </div>

            <InputLabel field="generatorPublicKey" />
            <div className={styles.inputContainer}>
              <Input
                data-name="generator-publicKey"
                autoComplete="off"
                onChange={onKeyChange}
                name="generatorPublicKey"
                value={generatorPublicKey.value}
                placeholder={t('A string value')}
                className={`${styles.input} generator-publicKey-input`}
                error={generatorPublicKey.error}
                status={generatorPublicKey.error ? 'error' : 'ok'}
                feedback={generatorPublicKey.message}
              />
            </div>

            <InputLabel field="blsPublicKey" />
            <div className={styles.inputContainer}>
              <Input
                data-name="bls-key"
                autoComplete="off"
                onChange={onKeyChange}
                name="blsPublicKey"
                value={blsPublicKey.value}
                placeholder={t('A string value')}
                className={`${styles.input} bls-key-input`}
                error={blsPublicKey.error}
                status={blsPublicKey.error ? 'error' : 'ok'}
                feedback={blsPublicKey.message}
              />
            </div>

            <InputLabel field="proofOfPossession" />
            <div className={styles.inputContainer}>
              <Input
                data-name="pop"
                autoComplete="off"
                onChange={onKeyChange}
                name="proofOfPossession"
                value={proofOfPossession.value}
                placeholder={t('A string value')}
                className={`${styles.input} pop-input`}
                error={proofOfPossession.error}
                status={proofOfPossession.error ? 'error' : 'ok'}
                feedback={proofOfPossession.message}
              />
            </div>
          </BoxContent>
        </>
      </TxComposer>
    </section>
  );
};

export default RegisterDelegateForm;
