import React from 'react';

import EmptyBoxState from '@toolbox/box/emptyState';
import Illustration from '@toolbox/illustration';

const EmptyState = ({ t }) => (
  <EmptyBoxState>
    <Illustration name="emptyWallet" />
    <p>{t('No votes in queue.')}</p>
  </EmptyBoxState>
);

export default EmptyState;
