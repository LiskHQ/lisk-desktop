/* eslint-disable max-lines */
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { withRouter } from 'react-router';
import Icon from 'src/theme/Icon';
import { useTranslation } from 'react-i18next';
import styles from './AddAccountChoice.css';

const AddAccountFlowButon = ({ iconName, text, onClick }) => (
  <button onClick={onClick} className={styles.addAccountFlowBtnWrapper}>
    <div>
      <Icon name={iconName} />
    </div>
    <span>{text}</span>
  </button>
);

const AccountAdd = ({ history }) => {
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
              <AddAccountFlowButon
                text="Secret recovery phrase"
                iconName="secretPassphrase"
                onClick={() => history.push('/account/add')}
              />
              <AddAccountFlowButon text="Restore from file" iconName="accountUpload" />
            </div>
            <p>
              {t('Don’t have a Lisk account yet?')}
              {' '}
              <a>Create one now</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default withRouter(AccountAdd);
