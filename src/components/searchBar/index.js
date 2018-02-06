import React from 'react';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import keyAction from './../search/keyAction';
import styles from './searchBar.css';

const Search = ({ history, t }) => (<div className={styles.searchBar}>
  <input onKeyUp={(e) => { keyAction(e, history); }}
    className={styles.input} type="text"
    placeholder={t('Search for Lisk ID or Transaction ID')}
  />
</div>);

export default withRouter(translate()(Search));
