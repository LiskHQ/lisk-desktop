import { cryptography } from '@liskhq/lisk-client';
import PropTypes from 'prop-types';
import React from 'react';

import { PrimaryButton } from '@basics/buttons';
import BoxFooter from '@basics/box/footer';
import Illustration from '@basics/illustration';
import { routes } from '@common/configuration';
import styles from './verifyMessage.css';

export default function Result({
  inputs, history, t,
}) {
  let isCorrect = false;
  try {
    isCorrect = cryptography.verifyMessageWithPublicKey({
      publicKey: Buffer.from(inputs.publicKey, 'hex'),
      signature: Buffer.from(inputs.signature, 'hex'),
      message: inputs.message,
    });
  } catch (e) {
    isCorrect = false;
  }

  const closeModal = () => {
    history.push(routes.wallet.path);
  };

  return (
    <div className={styles.result}>
      <Illustration
        name={isCorrect ? 'verifyMessageSuccess' : 'verifyMessageError'}
        className={styles.illustration}
      />
      <h1>{isCorrect ? t('The signature is correct') : t('The signature is incorrect')}</h1>
      <BoxFooter direction="horizontal">
        <PrimaryButton onClick={closeModal} className="go-back">{t('Back to wallet')}</PrimaryButton>
      </BoxFooter>
    </div>
  );
}

Result.propTypes = {
  inputs: PropTypes.object,
  t: PropTypes.func.isRequired,
  history: PropTypes.object,
};
