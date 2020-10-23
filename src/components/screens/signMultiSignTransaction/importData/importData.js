import React, { useState } from 'react';
import Box from '../../../toolbox/box';
import BoxContent from '../../../toolbox/box/content';
import BoxFooter from '../../../toolbox/box/footer';
import { PrimaryButton } from '../../../toolbox/buttons';
import ProgressBar from '../progressBar';

const ImportData = ({ t, nextStep }) => {
  const [jsonOutput, setJsonOutput] = useState(undefined);
  const reader = new FileReader();
  reader.onload = (evt) => {
    const parsedInput = JSON.parse(evt.target.result);
    setJsonOutput(parsedInput);
  };

  const onFileInputChange = (evt) => {
    reader.readAsText(evt.target.files[0]);
  };

  return (
    <section>
      <Box>
        <header>
          <h1>{t('Sign multisignature transaction')}</h1>
          <p>{t('If you have received a multisignature transaction that requires your signature, use this tool to review and sign it.')}</p>
        </header>
        <BoxContent>
          <ProgressBar current={1} />
          {'// TODO'}
          <p>{t('Paste transaction value')}</p>
          <input type="file" onChange={onFileInputChange} />
          <pre>
            {jsonOutput && JSON.stringify(jsonOutput)}
          </pre>
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
};

export default ImportData;
