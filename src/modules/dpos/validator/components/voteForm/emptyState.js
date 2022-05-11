import React from 'react';

import EmptyBoxState from '@theme/box/emptyState';
import Illustration from 'src/modules/common/components/illustration';

const EmptyState = ({ t }) => (
  <EmptyBoxState>
    <Illustration name="emptyWallet" />
    <p>{t('No votes in queue.')}</p>
  </EmptyBoxState>
);

export default EmptyState;
