import React from 'react';
import { PrimaryButton, TertiaryButton } from '../../toolbox/buttons/button';

export default function Result({ t, prevStep, finalCallback }) {
  return (
    <div>
      <h1>{t('The signature is correct')}</h1>
      Result TODO
      <div>
        <PrimaryButton onClick={finalCallback}>{t('Go to Dashboard')}</PrimaryButton>
        <TertiaryButton onClick={prevStep}>{t('Go back')}</TertiaryButton>
      </div>
    </div>
  );
}
