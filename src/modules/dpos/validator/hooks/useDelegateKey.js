import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { regex } from 'src/const/regex';

const generatorPublicKeyValidator = value => regex.generatorPublicKeyValidator.test(value);
const blsPublicKeyValidator = value => regex.blsPublicKeyValidator.test(value);
const proofOfPossessionValidator = value => regex.proofOfPossessionValidator.test(value);

const useDelegateKeys = (initGeneratorKey, initBlsKey, initPop) => {
  const [generatorPublicKey, setGeneratorPublicKey] = useState({
    value: initGeneratorKey ?? '',
    error: false,
    message: '',
  });
  const [blsPublicKey, setBlsPublicKey] = useState({
    value: initBlsKey ?? '',
    error: false,
    message: '',
  });
  const [proofOfPossession, setProofOfPossession] = useState({
    value: initPop ?? '',
    error: false,
    message: '',
  });
  const { t } = useTranslation();

  const setters = {
    generatorPublicKey: { setter: setGeneratorPublicKey, validator: generatorPublicKeyValidator },
    blsPublicKey: { setter: setBlsPublicKey, validator: blsPublicKeyValidator },
    proofOfPossession: { setter: setProofOfPossession, validator: proofOfPossessionValidator },
  };

  const setValue = (keyName, value) => {
    const isValid = setters[keyName].validator(value);
    setters[keyName].setter({
      value,
      error: !isValid,
      message: isValid ? '' : t('Please enter a valid value'),
    });
  };

  return [generatorPublicKey, blsPublicKey, proofOfPossession, setValue];
};

export default useDelegateKeys;
