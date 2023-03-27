import React from 'react';
import { withRouter } from 'react-router';
import { useTranslation } from 'react-i18next';
import routes from 'src/routes/routes';
import SetPasswordSuccess from '@auth/components/SetPasswordSuccess';
import MultiStep from '@common/components/OldMultiStep';
import EditAccountForm from './EditAccountForm';
import { useCurrentAccount } from '../../hooks';
import styles from './EditAccountForm.css';

const EditAccount = ({ history }) => {
  const { t } = useTranslation();
  const [currentAccount] = useCurrentAccount();

  return (
    <MultiStep key="edit-account-name" className={styles.container}>
      <EditAccountForm onBack={history.goBack} />
      <SetPasswordSuccess
        encryptedPhrase={currentAccount}
        headerText={t('Edit account name')}
        contentText={t(
          'Successfully edited, now you can download the encrypted secret recovery phrase to this effect.'
        )}
        buttonText={t('Back to wallet')}
        onClose={() => {
          history.push(routes.wallet.path);
        }}
      />
    </MultiStep>
  );
};

export default withRouter(EditAccount);
