import React from 'react';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import keyAction from './keyAction';
import styles from './search.css';

const Search = ({ history, t }) => (<div className={styles.search}>
  <div className={styles.wrapper}>
    <input onKeyUp={(e) => { keyAction(e, history); } }
      className={styles.input} type="text"
      placeholder={t('Search for Lisk ID or Transaction ID')}
    />
    <div className={styles.subTitle}>{t('Press enter to search')}</div>
  </div>
</div>);

export default withRouter(translate()(Search));
