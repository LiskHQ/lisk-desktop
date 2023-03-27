import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';

import { selectSearchParamValue } from 'src/utils/searchParams';
import Dialog from '@theme/dialog/dialog';
import { PrimaryButton } from '@theme/buttons';

import styles from './styles.css';

export const DeviceDisconnectDialog = ({ t, history }) => {
  const model = selectSearchParamValue(history.location.search, 'model');

  return (
    <Dialog hasClose className={`${grid.row} ${grid['center-xs']} ${styles.wrapper}`}>
      <Dialog.Title>{t('You are disconnected')}</Dialog.Title>
      <Dialog.Description>
        {t(
          'There is no connection to the {{model}}. Please check the cables if it happened by accident.',
          { model }
        )}
      </Dialog.Description>
      <Dialog.Options align="center">
        <PrimaryButton>{t('Ok')}</PrimaryButton>
      </Dialog.Options>
    </Dialog>
  );
};

export default withRouter(withTranslation()(DeviceDisconnectDialog));
