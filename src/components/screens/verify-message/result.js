import PropTypes from 'prop-types';
import React from 'react';
import { PrimaryButton, TertiaryButton } from '../../toolbox/buttons/button';

export default function Result({
  finalCallback, prevStep, t,
}) {
  return (
    <div>
      <h1>{t('The signature is correct')}</h1>
      Result Illustration TODO
      <div>
        <PrimaryButton onClick={finalCallback} className="go-to-dashboard">{t('Go to Dashboard')}</PrimaryButton>
        <TertiaryButton onClick={prevStep} className="go-back">{t('Go back')}</TertiaryButton>
      </div>
    </div>
  );
}

Result.propTypes = {
  finalCallback: PropTypes.func,
  prevStep: PropTypes.func,
  t: PropTypes.func.isRequired,
};
