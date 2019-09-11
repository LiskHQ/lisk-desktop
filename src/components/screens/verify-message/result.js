import PropTypes from 'prop-types';
import React from 'react';
import { PrimaryButton, TertiaryButton } from '../../toolbox/buttons/button';
import Illustration from '../../toolbox/illustration';

export default function Result({
  finalCallback, isCorrect, prevStep, t,
}) {
  return (
    <div>
      <h1>{isCorrect ? t('The signature is correct') : t('The signature is incorrect')}</h1>
      <Illustration name={isCorrect ? 'verifyMessageSuccess' : 'verifyMessageError'} />
      <div>
        <PrimaryButton onClick={finalCallback} className="go-to-dashboard">{t('Go to Dashboard')}</PrimaryButton>
        <TertiaryButton onClick={prevStep} className="go-back">{t('Go back')}</TertiaryButton>
      </div>
    </div>
  );
}

Result.propTypes = {
  finalCallback: PropTypes.func,
  isCorrect: PropTypes.bool,
  prevStep: PropTypes.func,
  t: PropTypes.func.isRequired,
};

Result.defaultProps = {
  isCorrect: false,
};
