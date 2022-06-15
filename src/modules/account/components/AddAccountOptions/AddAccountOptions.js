/* eslint-disable max-lines */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Icon from 'src/theme/Icon';
import routes from '@views/screens/router/routes';
import styles from './AddAccountOptions.css';

const AddAccountOptionButton = ({ iconName, text, onClick }) => (
  <button data-testid={iconName} onClick={onClick} className={styles.addAccountOptionBtnWrapper}>
    <div>
      <Icon name={iconName} />
    </div>
    <span>{text}</span>
  </button>
);

const AddAccountOptions = ({ history }) => {
  const { t } = useTranslation();

  return (
    <>
      <div className={`${styles.container} ${grid.row}`}>
        <div
          className={`${styles.wrapper} ${grid['col-xs-12']} ${grid['col-md-10']} ${grid['col-lg-8']}`}
        >
          <div className={`${styles.titleHolder} ${grid['col-xs-10']}`}>
            <h1>{t('Add account')}</h1>
            <p>
              {t('Select the applicable mode.')}
            </p>
            <div className={styles.selectRowWrapper}>
              <AddAccountOptionButton
                text="Secret recovery phrase"
                iconName="secretPassphrase"
                onClick={() => history.push(routes.addAccountBySecretRecovery.path)}
              />
              <AddAccountOptionButton
                text="Restore from file"
                iconName="accountUpload"
                onClick={() => history.push(routes.addAccountByFile.path)}
              />
            </div>
            <p>
              {t('Don’t have a Lisk account yet?')}
              {' '}
              <a href="#">Create one now</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default withRouter(AddAccountOptions);
