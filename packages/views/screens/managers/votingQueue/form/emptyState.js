import React from 'react';

import EmptyBoxState from '@views/basics/box/emptyState';
import Illustration from '@views/basics/illustration';

const EmptyState = ({ t }) => (
  <EmptyBoxState>
    <Illustration name="emptyWallet" />
    <p>{t('No votes in queue.')}</p>
  </EmptyBoxState>
);

export default EmptyState;
