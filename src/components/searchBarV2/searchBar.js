import React from 'react';
import { InputV2 } from '../toolbox/inputsV2';
import styles from './searchBar.css';

class SearchBar extends React.Component {
  constructor() {
    super();

    this.state = {
      searchTextValue: '',
    };

    this.onChangeSearchTextValue = this.onChangeSearchTextValue.bind(this);
  }

  onChangeSearchTextValue(e) {
    this.setState({ searchTextValue: e.target.value });
  }


  render() {
    const { searchTextValue } = this.state;
    const { t } = this.props;

    return (
      <div className={styles.wrapper}>
        <InputV2
          autoComplete={'off'}
          onChange={this.onChangeSearchTextValue}
          name='searchText'
          value={searchTextValue}
          placeholder={t('Search for delegate, Lisk ID or transaction ID')}
          className={`${styles.input}`}
        />
      </div>
    );
  }
}

export default SearchBar;
