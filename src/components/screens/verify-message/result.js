import PropTypes from 'prop-types';
import React from 'react';
import { PrimaryButton, TertiaryButton } from '../../toolbox/buttons/button';

export default function Result({
  finalCallback, isCorrect, prevStep, t,
}) {
  return (
    <div>
      <h1>{isCorrect ? t('The signature is correct') : t('The signature is correct')}</h1>
      Result Illustration TODO
      <div>
        <PrimaryButton onClick={finalCallback}>{t('Go to Dashboard')}</PrimaryButton>
        <TertiaryButton onClick={prevStep}>{t('Go back')}</TertiaryButton>
      </div>
    </div>
  );
}

Result.propTypes = {
  finalCallback: PropTypes.func.isRequired,
  isCorrect: PropTypes.bool.isRequired,
  prevStep: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};
