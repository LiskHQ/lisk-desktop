import React from 'react';
import { useTranslation } from 'react-i18next';
import Box from 'src/theme/box';
import { PrimaryButton } from 'src/theme/buttons';
import Illustration from 'src/modules/common/components/illustration';
import { removeThenAppendSearchParamsToUrl } from 'src/utils/searchParams';
import Dialog from 'src/theme/dialog/dialog';
import styles from './AddApplicationSuccess.css';

const AddApplicationSuccess = ({ history }) => {
  const { t } = useTranslation();
  const onAddSuccess = () => {
    removeThenAppendSearchParamsToUrl(history, { modal: 'manageApplications' }, ['modal']);
  };

  return (
    <Dialog hasClose>
      <Box className={styles.wrapper}>
        <Illustration name="addApplicationSuccess" className={styles.illustration} />
        <Box className={styles.textContent}>
          <div className={`${styles.header} add-application-success-header`}>
            {t('Perfect! Application has now been added')}
          </div>
          <div className={styles.detail}>
            {t('You can see a list of your applications on the network dropdown.')}
          </div>
        </Box>
        <Box className={styles.footer}>
          <PrimaryButton onClick={onAddSuccess} className="add-application-success-button">
            {t('Continue to wallet')}
          </PrimaryButton>
        </Box>
      </Box>
    </Dialog>
  );
};

export default AddApplicationSuccess;
