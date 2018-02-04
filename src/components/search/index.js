import React from 'react';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import keyAction from './keyAction';
import localJSONStorage from './../../utils/localJSONStorage';
import styles from './search.css';

const Search = ({ history, t }) => {
  const getRecentSearches = () => localJSONStorage.get('searches');

  return (<div className={styles.search}>
    <div className={styles.wrapper}>
      <input
        autoFocus
        onKeyUp={(e) => { keyAction(e, history); }}
        className={styles.input} type="text"
        placeholder={t('Search for Lisk ID or Transaction ID')}
      />
      {getRecentSearches().length
        ? <ul className={styles.recent}>
          <li>Latest search</li>
          {getRecentSearches().map((search, i) =>
            (<li key={i} className={styles.item}>{search}</li>))}
        </ul>
        : <div className={styles.subTitle}>{t('Press enter to search')}</div>
      }
    </div>
  </div>);
};

export default withRouter(translate()(Search));
