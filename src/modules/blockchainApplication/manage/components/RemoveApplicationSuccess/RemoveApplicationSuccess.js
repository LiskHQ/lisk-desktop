import React from 'react';
import Dialog from '@theme/dialog/dialog';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Icon from 'src/theme/Icon';
import { PrimaryButton } from 'src/theme/buttons';
import { useTranslation } from 'react-i18next';
import styles from './RemoveApplicationSuccess.css';

const RemoveApplicationSuccess = ({ history, sharedData: { application } }) => {
  const { t } = useTranslation();
  return (
    <Dialog hasClose className={`${styles.dialogWrapper} ${grid.row} ${grid['center-xs']}`}>
      <div className={`${styles.wrapper} remove-app-success-wrapper`}>
        <Icon name="successCheckMark" />
        <p>{t('Application has now been removed')}</p>
        <p>
          {t('You can always add')} <a href="#">{application.data.chainName}</a>{' '}
          {t('again to your application list.')}
        </p>
        <PrimaryButton
          className={`${styles.button}`}
          onClick={() => {
            history.push('/wallet');
          }}
        >
          {t('Continue to wallet')}
        </PrimaryButton>
      </div>
    </Dialog>
  );
};

export default RemoveApplicationSuccess;
