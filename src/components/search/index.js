import React from 'react';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import keyAction from './keyAction';
import localJSONStorage from './../../utils/localJSONStorage';
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
    return (<div className={styles.search}>
      <div className={styles.wrapper}>
        <input
          autoFocus
          onKeyUp={(e) => { keyAction(e, this.props.history); }}
          onChange={(event) => { this.setState({ inputValue: event.target.value }); }}
          className={styles.input} type="text"
          placeholder={this.props.t('Search for Lisk ID or Transaction ID')}
        />
        {
          this.showRecentSearches()
            ? <ul className={styles.recent}>
              <li className={styles.item}>{this.props.t('Latest search')}</li>
              {this.getRecentSearches().map((search, i) =>
                (<li key={i} className={styles.item}>{search}</li>))}
            </ul>
            : null
        }
        {this.state.inputValue.length > 0 && <div className={styles.subTitle}>{this.props.t('Press \u21B2 enter to search')}</div>}
      </div>
    </div>);
  }
}

export default withRouter(translate()(Search));
