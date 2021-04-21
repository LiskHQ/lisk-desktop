import React from 'react';
import { withTranslation } from 'react-i18next';
import MultiStep from '@shared/multiStep';
import Dialog from '@toolbox/dialog/dialog';
import Summary from './summary';
import Status from './status';

const ReclaimBalanceModal = ({ t }) => (
  <Dialog hasClose>
    <MultiStep>
      <Summary t={t} />
      <Status t={t} />
    </MultiStep>
  </Dialog>
);

export default withTranslation()(ReclaimBalanceModal);
