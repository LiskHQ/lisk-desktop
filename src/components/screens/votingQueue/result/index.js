import React from 'react';
import Box from '../../../toolbox/box';
import BoxContent from '../../../toolbox/box/content';
import ToggleIcon from '../toggleIcon';

const Result = ({
  t = s => s,
}) => (
  <section>
    <Box>
      <ToggleIcon />
      <header>
        <h1>{t('Voting Confirmation')}</h1>
      </header>

    </Box>
  </section>
);

export default Result;
