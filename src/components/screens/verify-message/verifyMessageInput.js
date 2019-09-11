import PropTypes from 'prop-types';
import React from 'react';
import { Input } from '../../toolbox/inputs';
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
        <Box.InfoText>
          {t('Use this tool to verify the validity of a signed message. This allows you to ensure that the person who signed the message was in fact the account owner')}
        </Box.InfoText>
        <Input
          className="message"
          placeholder={t('Write a message')}
          label={t('Message')}
        />
        <Input
          className="publicKey"
          placeholder={t('Public Key')}
          label={t('Public Key')}
        />
        <Input
          className="signature"
          placeholder={t('Signature')}
          label={t('Signature')}
        />
      </Box.Content>
      <Box.Footer>
        <PrimaryButton onClick={goNext} className="continue">{t('Continue')}</PrimaryButton>
        <TertiaryButton onClick={history.goBack} className="go-back">{t('Go back')}</TertiaryButton>
      </Box.Footer>
    </Box>
  );
}

VerifyMessageInput.propTypes = {
  history: PropTypes.object.isRequired,
  nextStep: PropTypes.func,
  t: PropTypes.func.isRequired,
};
