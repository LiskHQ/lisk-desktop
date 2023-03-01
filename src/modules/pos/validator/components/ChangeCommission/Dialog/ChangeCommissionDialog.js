/* istanbul ignore file */
import React from 'react';
import { withRouter } from 'react-router';
import { useTranslation } from 'react-i18next';

import MultiStep from '@common/components/OldMultiStep';
import TxSignatureCollector from '@transaction/components/TxSignatureCollector';
import Dialog from '@theme/dialog/dialog';
import { ChangeCommissionForm as Form } from '../Form';
import Summary from '../Summary';
import Status from '../Status';

export const ChangeCommission = ({ history }) => {
  const { t } = useTranslation();

  return (
    <Dialog hasClose size="sm">
      <MultiStep prevPage={history.goBack} backButtonLabel={t('Back')}>
        <Form />
        <Summary />
        <TxSignatureCollector />
        <Status />
      </MultiStep>
    </Dialog>
  );
};

export const ChangeCommissionDialog = withRouter(ChangeCommission);
