import { cryptography } from '@liskhq/lisk-client';
import PropTypes from 'prop-types';
import React from 'react';
import { SecondaryButton } from '../../toolbox/buttons';
import BoxFooter from '../../toolbox/box/footer';
import Illustration from '../../toolbox/illustration';
import styles from './verifyMessage.css';

export default function Result({
  inputs, prevStep, t,
}) {
  let isCorrect = false;
  try {
    isCorrect = cryptography.verifyMessageWithPublicKey(inputs);
  } catch (e) {
    isCorrect = false;
  }

  return (
    <div className={styles.result}>
      <Illustration
        name={isCorrect ? 'verifyMessageSuccess' : 'verifyMessageError'}
        className={styles.illustration}
      />
      <h1>{isCorrect ? t('The signature is correct') : t('The signature is incorrect')}</h1>
      <BoxFooter direction="horizontal">
        <SecondaryButton onClick={prevStep} className="go-back">{t('Go back')}</SecondaryButton>
      </BoxFooter>
    </div>
  );
}

Result.propTypes = {
  inputs: PropTypes.object,
  prevStep: PropTypes.func,
  t: PropTypes.func.isRequired,
};
