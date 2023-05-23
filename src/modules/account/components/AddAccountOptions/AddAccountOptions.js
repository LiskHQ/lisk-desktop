/* eslint-disable max-lines */
import React from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Icon from 'src/theme/Icon';
import routes from 'src/routes/routes';
import styles from './AddAccountOptions.css';

const addAccountOptions = (t) => [
  {
    text: t('Secret recovery phrase'),
    iconName: 'secretPassphrase',
    pathName: routes.addAccountBySecretRecovery.path,
  },
  {
    text: t('Restore from backup'),
    iconName: 'accountUpload',
    pathName: routes.addAccountByFile.path,
  },
];

const AddAccountOptionButton = ({ iconName, text, onClick }) => (
  <button data-testid={iconName} onClick={onClick} className={styles.addAccountOptionBtnWrapper}>
    <div>
      <Icon name={iconName} />
    </div>
    <span>{text}</span>
  </button>
);

const AddAccountOptions = () => {
  const history = useHistory();
  const { search } = useLocation();
  const { t } = useTranslation();

  return (
    <>
      <div className={`${styles.container} ${grid.row}`}>
        <div
          className={`${styles.wrapper} ${grid['col-xs-12']} ${grid['col-md-12']} ${grid['col-lg-10']}`}
        >
          <div className={`${styles.titleHolder} ${grid['col-xs-10']}`}>
            <h1>{t('Add your account')}</h1>
            <p>{t('Choose an option to add your account to Lisk wallet.')}</p>
            <div className={styles.selectRowWrapper}>
              {addAccountOptions(t).map(({ text, iconName, pathName }) => (
                <AddAccountOptionButton
                  key={text}
                  text={text}
                  iconName={iconName}
                  onClick={() => history.push({ pathName, search })}
                />
              ))}
            </div>
            <p>
              {t('Don’t have a Lisk account yet?')}{' '}
              <Link to={routes.register.path}>Create one now</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddAccountOptions;
