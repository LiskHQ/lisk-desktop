import React from 'react';
import { PrimaryButton, TertiaryButton } from '../../toolbox/buttons/button';
import Box from '../../toolbox/box';

export default function VerifyMessageInput({ t, nextStep, history }) {
  return (
    <Box width="medium" main>
      <Box.Header>
        <h1>{t('Verify message')}</h1>
      </Box.Header>
      <Box.Content>
        VerifyMessageInput TODO
      </Box.Content>
      <Box.Footer>
        <PrimaryButton onClick={nextStep}>{t('Continue')}</PrimaryButton>
        <TertiaryButton onClick={history.goBack}>{t('Go back')}</TertiaryButton>
      </Box.Footer>
    </Box>
  );
}
