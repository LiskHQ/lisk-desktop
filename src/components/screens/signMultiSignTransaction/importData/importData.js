import React from 'react';
import Box from '../../../toolbox/box';
import BoxContent from '../../../toolbox/box/content';
import BoxFooter from '../../../toolbox/box/footer';
import { PrimaryButton } from '../../../toolbox/buttons';

const ImportData = ({ t, nextStep }) => (
  <section>
    <Box>
      <header>
        <h1>{t('Sign multisignature transaction')}</h1>
        <p>{t('If you have received a multisignature transaction that requires your signature, use this tool to review and sign it.')}</p>
      </header>
      <BoxContent>
        {'// TODO'}
      </BoxContent>
      <BoxFooter>
        <PrimaryButton
          className="confirm-button"
          size="l"
          onClick={nextStep}
        >
          {t('Review and Sign')}
        </PrimaryButton>
      </BoxFooter>
    </Box>
  </section>
);

export default ImportData;
