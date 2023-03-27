import React from 'react';
import PropTypes from 'prop-types';
import { PrimaryButton } from 'src/theme/buttons';
import BoxFooter from 'src/theme/box/footer';
import Illustration from 'src/modules/common/components/illustration';
import routes from 'src/routes/routes';
import useVerifyMessageValidator from '../../hooks/useVerifyMessageValidator';
import styles from './validityStatus.css';

export default function ValidityStatus({ inputs, history, t }) {
  const isCorrect = useVerifyMessageValidator(inputs);
  const closeModal = () => {
    history.push(routes.wallet.path);
  };

  return (
    <div className={styles.result}>
      <Illustration
        name={isCorrect ? 'verifyMessageSuccess' : 'verifyMessageError'}
        className={styles.illustration}
      />
      <h1>{isCorrect ? t('Signature is correct') : t('Signature is incorrect')}</h1>
      <BoxFooter direction="horizontal">
        <PrimaryButton onClick={closeModal} className="go-back">
          {t('Back to wallet')}
        </PrimaryButton>
      </BoxFooter>
    </div>
  );
}

ValidityStatus.propTypes = {
  inputs: PropTypes.object,
  t: PropTypes.func.isRequired,
  history: PropTypes.object,
};
