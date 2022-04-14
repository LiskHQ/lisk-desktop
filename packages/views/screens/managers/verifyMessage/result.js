// import { cryptography } from '@liskhq/lisk-client';
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { PrimaryButton } from '@basics/buttons';
import BoxFooter from '@basics/box/footer';
import Illustration from '@basics/illustration';
import routes from '@screens/router/routes';
import verifyMessageValidator from '@wallet/manager/result';
import styles from './verifyMessage.css';

export default function Result({ inputs, history, t }) {
  const isCorrect = useMemo(() => verifyMessageValidator(inputs), [inputs]);
  const closeModal = () => {
    history.push(routes.wallet.path);
  };

  return (
    <div className={styles.result}>
      <Illustration
        name={isCorrect ? 'verifyMessageSuccess' : 'verifyMessageError'}
        className={styles.illustration}
      />
      <h1>
        {isCorrect
          ? t('The signature is correct')
          : t('The signature is incorrect')}
      </h1>
      <BoxFooter direction="horizontal">
        <PrimaryButton onClick={closeModal} className="go-back">
          {t('Back to wallet')}
        </PrimaryButton>
      </BoxFooter>
    </div>
  );
}

Result.propTypes = {
  inputs: PropTypes.object,
  t: PropTypes.func.isRequired,
  history: PropTypes.object,
};
