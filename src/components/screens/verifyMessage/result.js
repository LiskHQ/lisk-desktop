import { cryptography } from '@liskhq/lisk-client';
import PropTypes from 'prop-types';
import React from 'react';
import { PrimaryButton, TertiaryButton } from '../../toolbox/buttons/button';
import BoxFooter from '../../toolbox/box/footer';
import Illustration from '../../toolbox/illustration';
import styles from './verifyMessage.css';

export default function Result({
  finalCallback, inputs, prevStep, t,
}) {
  let isCorrect = false;
  try {
    isCorrect = cryptography.verifyMessageWithPublicKey(inputs);
  } catch (e) {
    isCorrect = false;
  }

  return (
    <div className={styles.result}>
      <h1>{isCorrect ? t('The signature is correct') : t('The signature is incorrect')}</h1>
      <Illustration name={isCorrect ? 'verifyMessageSuccess' : 'verifyMessageError'} />
      <BoxFooter>
        <PrimaryButton onClick={finalCallback} className="go-to-dashboard">{t('Go to Dashboard')}</PrimaryButton>
        <TertiaryButton onClick={prevStep} className="go-back">{t('Go back')}</TertiaryButton>
      </BoxFooter>
    </div>
  );
}

Result.propTypes = {
  finalCallback: PropTypes.func,
  inputs: PropTypes.object,
  prevStep: PropTypes.func,
  t: PropTypes.func.isRequired,
};
