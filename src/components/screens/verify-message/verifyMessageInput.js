import PropTypes from 'prop-types';
import React from 'react';
import { PrimaryButton, TertiaryButton } from '../../toolbox/buttons/button';
import Box from '../../toolbox/box';

export default function VerifyMessageInput({ t, nextStep, history }) {
  function goNext() {
    nextStep({ isCorrect: false });
  }

  return (
    <Box width="medium" main>
      <Box.Header>
        <h1>{t('Verify message')}</h1>
      </Box.Header>
      <Box.Content>
        VerifyMessageInput TODO
      </Box.Content>
      <Box.Footer>
        <PrimaryButton onClick={goNext}>{t('Continue')}</PrimaryButton>
        <TertiaryButton onClick={history.goBack}>{t('Go back')}</TertiaryButton>
      </Box.Footer>
    </Box>
  );
}

VerifyMessageInput.propTypes = {
  history: PropTypes.object.isRequired,
  nextStep: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};
