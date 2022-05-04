import React from 'react';

import EmptyBoxState from 'src/theme/box/emptyState';
import Illustration from '@basics/illustration';

const EmptyState = ({ t }) => (
  <EmptyBoxState>
    <Illustration name="emptyWallet" />
    <p>{t('No votes in queue.')}</p>
  </EmptyBoxState>
);

export default EmptyState;
