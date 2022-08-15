import React from 'react';
import { useTranslation } from 'react-i18next';
import { MODULE_COMMANDS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import { Input } from 'src/theme';
import TxComposer from '@transaction/components/TxComposer';
import useDelegateName from '../../hooks/useDelegateName';
import useDelegateKey from '../../hooks/useDelegateKey';
import InputLabel from './InputLabel';
import styles from './form.css';

const isFormValid = (name, generatorPublicKey, blsPublicKey, proofOfPossession) => (
  !name.error && !name.loading && !generatorPublicKey.error
  && !blsPublicKey.error && !proofOfPossession.error
);

const getTooltips = (field, t) => {
  if (field === 'name') {
    return t('Max. 20 characters, a-z, 0-1, no special characters except !@$_.');
  }
  return t('Run lisk keys:generate and copy the value of {{field}}', { field });
};

const RegisterDelegateForm = ({
  nextStep,
  prevState,
}) => {
  const { t } = useTranslation();
  const [name, setName] = useDelegateName(prevState?.rawTx?.params.username);
  const [generatorPublicKey, setGenKey] = useDelegateKey(
    'generatorPublicKey',
    t('Please enter a valid generator key value'),
    prevState?.rawTx?.params.generatorPublicKey,
  );
  const [blsPublicKey, setBlsKey] = useDelegateKey(
    'blsPublicKey',
    t('Please enter a valid bls key value'),
    prevState?.rawTx?.params.blsPublicKey,
  );
  const [proofOfPossession, setPop] = useDelegateKey(
    'proofOfPossession',
    t('Please enter a valid proof of possession value'),
    prevState?.rawTx?.params.proofOfPossession,
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

  const transaction = {
    moduleCommandID: MODULE_COMMANDS_NAME_ID_MAP.registerDelegate,
    params: {
      username: name.value,
      blsPublicKey: blsPublicKey.value,
      generatorPublicKey: generatorPublicKey.value,
      proofOfPossession: proofOfPossession.value,
    },
    isValid: isFormValid(name, generatorPublicKey, blsPublicKey, proofOfPossession),
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
            <InputLabel
              title={t('Your name')}
              tooltip={getTooltips('name', t)}
            />
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

            <InputLabel
              title={t('Generator key')}
              tooltip={getTooltips('generatorPublicKey', t)}
            />
            <div className={styles.inputContainer}>
              <Input
                data-name="generator-publicKey"
                autoComplete="off"
                onChange={(e) => setGenKey(e.target.value)}
                name="generatorPublicKey"
                value={generatorPublicKey.value}
                placeholder={t('A string value')}
                className={`${styles.input} generator-publicKey-input`}
                error={generatorPublicKey.error}
                status={generatorPublicKey.error ? 'error' : 'ok'}
                feedback={generatorPublicKey.message}
              />
            </div>

            <InputLabel
              title={t('BLS Key')}
              tooltip={getTooltips('blsPublicKey', t)}
            />
            <div className={styles.inputContainer}>
              <Input
                data-name="bls-key"
                autoComplete="off"
                onChange={(e) => setBlsKey(e.target.value)}
                name="blsPublicKey"
                value={blsPublicKey.value}
                placeholder={t('A string value')}
                className={`${styles.input} bls-key-input`}
                error={blsPublicKey.error}
                status={blsPublicKey.error ? 'error' : 'ok'}
                feedback={blsPublicKey.message}
              />
            </div>

            <InputLabel
              title={t('BLS Proof Of Possession')}
              tooltip={getTooltips('proofOfPossession', t)}
            />
            <div className={styles.inputContainer}>
              <Input
                data-name="pop"
                autoComplete="off"
                onChange={(e) => setPop(e.target.value)}
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
