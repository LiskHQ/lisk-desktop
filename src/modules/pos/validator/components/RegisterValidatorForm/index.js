import React from 'react';
import { useTranslation } from 'react-i18next';
import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import { Input } from 'src/theme';
import TxComposer from '@transaction/components/TxComposer';
import useValidatorName from '../../hooks/useValidatorName';
import useValidatorKey from '../../hooks/useValidatorKey';
import InputLabel from './InputLabel';
import styles from './Form.css';
import { usePosConstants } from '../../hooks/queries';
import usePosToken from '../../hooks/usePosToken';

const isFormValid = (name, generatorKey, blsKey, proofOfPossession) =>
  !name.error && !name.loading && !generatorKey.error && !blsKey.error && !proofOfPossession.error;

const getTooltips = (field, t) => {
  if (field === 'name') {
    return t('Max. 20 characters, a-z, 0-1, no special characters except !@$_.');
  }
  return t('Run lisk keys:generate and copy the value of {{field}}', { field });
};

// eslint-disable-next-line max-statements
const RegisterValidatorForm = ({ nextStep, prevState }) => {
  const { t } = useTranslation();
  const { params } = prevState?.transactionJSON || {};
  const [name, setName] = useValidatorName(params?.name);
  const [generatorKey, setGenKey] = useValidatorKey(
    'generatorKey',
    t('Please enter a valid generator key value'),
    params?.generatorKey
  );
  const [blsKey, setBlsKey] = useValidatorKey(
    'blsKey',
    t('Please enter a valid bls key value'),
    params?.blsKey
  );
  const [proofOfPossession, setPop] = useValidatorKey(
    'proofOfPossession',
    t('Please enter a valid proof of possession value'),
    params?.proofOfPossession
  );

  const { data: posConstants } = usePosConstants();
  const { token } = usePosToken();

  const onConfirm = (formProps, transactionJSON, selectedPriority, fees) => {
    nextStep({
      selectedPriority,
      formProps,
      transactionJSON,
      fees,
    });
  };

  const onChangeUsername = ({ target: { value } }) => {
    setName(value);
  };

  const registerValidatorFormProps = {
    isFormValid: isFormValid(name, generatorKey, blsKey, proofOfPossession),
    moduleCommand: MODULE_COMMANDS_NAME_MAP.registerValidator,
    fields: { token },
    extraCommandFee: posConstants?.data?.extraCommandFees?.validatorRegistrationFee || 0,
  };
  const commandParams = {
    name: name.value,
    blsKey: blsKey.value,
    generatorKey: generatorKey.value,
    proofOfPossession: proofOfPossession.value,
  };

  return (
    <section className={styles.wrapper}>
      <TxComposer
        onConfirm={onConfirm}
        formProps={registerValidatorFormProps}
        commandParams={commandParams}
        buttonTitle="Go to confirmation"
      >
        <>
          <BoxHeader className={styles.header}>
            <h2>{t('Register validator')}</h2>
          </BoxHeader>
          <BoxContent className={`${styles.container} select-name-container`}>
            <InputLabel title={t('Your name')} tooltip={getTooltips('name', t)} />
            <div className={styles.inputContainer}>
              <Input
                data-name="validator-username"
                autoComplete="off"
                onChange={onChangeUsername}
                name="validator-username"
                value={name.value}
                placeholder={t('e.g. peter_pan')}
                className={`${styles.input} select-name-input`}
                error={name.error && name.value.length}
                isLoading={name.loading}
                status={name.error && name.value.length ? 'error' : 'ok'}
                feedback={name.message}
              />
            </div>

            <InputLabel title={t('Generator key')} tooltip={getTooltips('generatorKey', t)} />
            <div className={styles.inputContainer}>
              <Input
                data-name="generator-publicKey"
                autoComplete="off"
                onChange={(e) => setGenKey(e.target.value)}
                name="generatorKey"
                value={generatorKey.value}
                placeholder={t('A string value')}
                className={`${styles.input} generator-publicKey-input`}
                error={generatorKey.error}
                status={generatorKey.error ? 'error' : 'ok'}
                feedback={generatorKey.message}
              />
            </div>

            <InputLabel title={t('BLS Key')} tooltip={getTooltips('blsKey', t)} />
            <div className={styles.inputContainer}>
              <Input
                data-name="bls-key"
                autoComplete="off"
                onChange={(e) => setBlsKey(e.target.value)}
                name="blsKey"
                value={blsKey.value}
                placeholder={t('A string value')}
                className={`${styles.input} bls-key-input`}
                error={blsKey.error}
                status={blsKey.error ? 'error' : 'ok'}
                feedback={blsKey.message}
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

export default RegisterValidatorForm;
