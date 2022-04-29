import React from 'react';
import { withTranslation } from 'react-i18next';
import MultiStep from '@shared/multiStep';
import Introduction from '@legacy/components/introduction';
import Reclaim from '@legacy/components/reclaim';

const ReclaimBalance = ({ t }) => (
  <MultiStep>
    <Introduction t={t} />
    <Reclaim t={t} />
  </MultiStep>
);

export default withTranslation()(ReclaimBalance);
