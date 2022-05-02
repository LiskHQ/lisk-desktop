import React from 'react';
import { withTranslation } from 'react-i18next';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import Introduction from '../components/introduction';
import Reclaim from '../components/reclaim';

const ReclaimBalance = ({ t }) => (
  <MultiStep>
    <Introduction t={t} />
    <Reclaim t={t} />
  </MultiStep>
);

export default withTranslation()(ReclaimBalance);
