import PropTypes from 'prop-types';
import React from 'react';
import { PrimaryButton, TertiaryButton } from '../../toolbox/buttons/button';
import Box from '../../toolbox/box';
import Illustration from '../../toolbox/illustration';

export default function Result({
  finalCallback, isCorrect, prevStep, t,
}) {
  return (
    <div>
      <h1>{isCorrect ? t('The signature is correct') : t('The signature is incorrect')}</h1>
      <Illustration name={isCorrect ? 'verifyMessageSuccess' : 'verifyMessageError'} />
      <Box.Footer>
        <PrimaryButton onClick={finalCallback} className="go-to-dashboard">{t('Go to Dashboard')}</PrimaryButton>
        <TertiaryButton onClick={prevStep} className="go-back">{t('Go back')}</TertiaryButton>
      </Box.Footer>
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
