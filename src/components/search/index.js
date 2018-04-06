import React from 'react';
import { translate } from 'react-i18next';
import { FontIcon } from '../fontIcon';
import { visitAndSaveSearch, visitAndSaveSearchOnEnter, visit } from './keyAction';
import localJSONStorage from './../../utils/localJSONStorage';
import { ActionButton } from './../toolbox/buttons/button';
import Input from '../toolbox/inputs/input';
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
        <Input
          className={`${styles.input} search-input`}
          autoFocus={true}
          placeholder={this.props.t('Search for Lisk ID or Transaction ID')}
          onKeyUp={(e) => { visitAndSaveSearchOnEnter(e, history); }}
          onChange={(event) => { this.setState({ inputValue: event }); }}
          value={this.state.inputValue}
          theme={styles}
        >
          <span
            id='input-search-button'
            onClick={() => { visitAndSaveSearch(this.state.inputValue, history); }}
            className={`${styles.button} input-search-button`}>Search <FontIcon className={styles.icon} value='arrow-right'/></span>
        </Input>
        {
          this.showRecentSearches()
            ? <ul className={styles.recent}>
              <li className={styles.item}>{t('Last searches')}</li>
              {this.getRecentSearches().map((search, i) =>
                (<li key={i}
                  className={`${styles.item} ${styles.clickable} search-result`}
                  onClick={() => { visit(search, history); }}
                >
                  {search}
                </li>))}
            </ul>
            : null
        }
        {this.state.inputValue.length > 0 && <ActionButton
          id='search-button'
          onClick={() => { visitAndSaveSearch(this.state.inputValue, history); }}
          className={styles.button}>{t('Search')}</ActionButton>}
        {this.state.inputValue.length > 0 && <div className={styles.subTitle}>{t('You can also press \u21B2 enter to search')}</div>}
      </div>
    </Box>);
  }
}

export default translate()(Search);
