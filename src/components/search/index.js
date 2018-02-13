import React from 'react';
import { translate } from 'react-i18next';
import { visitAndSaveSearch, visit } from './keyAction';
import localJSONStorage from './../../utils/localJSONStorage';
import Box from '../box';
import styles from './search.css';

class Search extends React.Component {
  constructor() {
    super();
    this.state = { inputValue: '' };
  }

  // eslint-disable-next-line class-methods-use-this
  getRecentSearches() {
    return localJSONStorage.get('searches', []);
  }

  showRecentSearches() {
    return this.getRecentSearches().length && this.state.inputValue.length === 0;
  }

  render() {
    const { history, t } = this.props;
    return (<Box className={styles.search}>
      <div className={styles.wrapper}>
        <input
          autoFocus
          onKeyUp={(e) => { visitAndSaveSearch(e, history); }}
          onChange={(event) => { this.setState({ inputValue: event.target.value }); }}
          className={styles.input} type="text"
          value={this.state.inputValue}
          placeholder={this.props.t('Search for Lisk ID or Transaction ID')}
        />
        {
          this.showRecentSearches()
            ? <ul className={styles.recent}>
              <li className={styles.item}>{t('Latest search')}</li>
              {this.getRecentSearches().map((search, i) =>
                (<li key={i}
                  className={`${styles.item} ${styles.clickable}`}
                  onClick={() => { visit(search, history); }}
                >
                  {search}
                </li>))}
            </ul>
            : null
        }
        {this.state.inputValue.length > 0 && <div className={styles.subTitle}>{t('Press \u21B2 enter to search')}</div>}
      </div>
    </Box>);
  }
}

export default translate()(Search);
