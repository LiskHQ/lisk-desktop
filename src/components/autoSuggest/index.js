import React from 'react';
import Input from 'react-toolbox/lib/input';
import styles from './autoSuggest.css';
import LiskAmount from './../liskAmount';
import { FontIcon } from '../fontIcon';
import ResultsList from './resultsList';
import routes from './../../constants/routes';
import keyCodes from './../../constants/keyCodes';
import { saveSearch } from './../search/keyAction';

class AutoSuggest extends React.Component {
  constructor(props) {
    super(props);
    this.submitSearch = this.submitSearch.bind(this);
    this.selectedRow = null;
    this.lastSearch = null;
    this.state = {
      show: false,
      value: '',
      selectedIdx: 0,
      resultsLength: 0,
      placeholder: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    this.selectedRow = null;
    const resultsLength = ['delegates', 'addresses', 'transactions'].reduce((total, resultKey) =>
      total + nextProps.results[resultKey].length, 0);
    let placeholder = '';
    if (nextProps.results.delegates.length > 0) {
      placeholder = this.getValueFromCurrentIdx(0, nextProps.results);
    }
    this.setState({ resultsLength, selectedIdx: 0, placeholder });
  }

  onResultClick(id, type) {
    let urlSearch;
    switch (type) {
      case 'addresses':
      case 'delegates':
        urlSearch = `${routes.accounts.pathPrefix}${routes.accounts.path}/${id}`;
        break;
      case 'transactions':
        urlSearch = `${routes.transactions.pathPrefix}${routes.transactions.path}/${id}`;
        break;
      /* istanbul ignore next */
      default:
        break;
    }
    saveSearch(id);
    this.props.history.push(urlSearch);
  }

  setSelectedRow(el) {
    this.selectedRow = el;
  }

  submitSearch() {
    if (['addresses', 'transactions'].filter(entity =>
      entity === this.selectedRow.dataset.type).length > 0) {
      this.setState({ value: this.selectedRow.dataset.id });
    } else {
      this.setState({ value: this.state.placeholder });
    }
    this.inputRef.blur();
    this.onResultClick(this.selectedRow.dataset.id, this.selectedRow.dataset.type);
  }

  submitAnySearch() {
    this.inputRef.blur();
    this.props.history.push(`${routes.searchResult.pathPrefix}${routes.searchResult.path}/${encodeURIComponent(this.state.value)}`);
  }

  search(searchTerm) {
    this.setState({ value: searchTerm, placeholder: '' });
    if (searchTerm.length < 3) {
      return;
    }

    this.setState({ show: true });
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (searchTerm === this.state.value) {
        this.lastSearch = searchTerm;
        this.props.searchSuggestions({
          activePeer: this.props.activePeer,
          searchTerm: this.state.value,
        });
      }
    }, 250);
  }

  handleArrowDown() {
    let currentIdx = this.state.selectedIdx;
    currentIdx = (currentIdx === this.resultsLength) ? this.resultsLength : currentIdx += 1;
    const placeholder = this.getValueFromCurrentIdx(currentIdx, this.props.results);
    this.setState({ selectedIdx: currentIdx, placeholder });
  }

  handleArrowUp() {
    let currentIdx = this.state.selectedIdx;
    currentIdx = (currentIdx === 0) ? 0 : currentIdx -= 1;
    const placeholder = this.getValueFromCurrentIdx(currentIdx, this.props.results);
    this.setState({ selectedIdx: currentIdx, placeholder });
  }

  /* eslint-disable class-methods-use-this */
  getValueFromCurrentIdx(index, results) {
    let targetVal = '';
    if (index < results.delegates.length) {
      targetVal = results.delegates[index].username;
    } else if (index <
      results.delegates.length + results.addresses.length) {
      const targetIdx = index - results.delegates.length;
      targetVal = results.addresses[targetIdx].address;
    } else if (index <
      results.delegates.length +
      results.addresses.length +
      results.transactions.length) {
      const targetIdx = index -
        results.delegates.length -
        results.addresses.length;
      targetVal = results.transactions[targetIdx].id;
    }
    return targetVal;
  }
  /* eslint-enable class-methods-use-this */

  handleSubmit() {
    if (this.state.resultsLength > 0) {
      this.submitSearch();
      this.props.searchClearSuggestions();
      this.setState({ placeholder: '' });
    } else {
      this.submitAnySearch();
    }
  }

  handleKey(event) {
    switch (event.keyCode) {
      case keyCodes.arrowDown:
        this.handleArrowDown();
        event.preventDefault();
        break;
      case keyCodes.arrowUp:
        this.handleArrowUp();
        event.preventDefault();
        break;
      case keyCodes.escape:
        this.closeDropdown();
        break;
      case keyCodes.enter:
      case keyCodes.tab:
        this.handleSubmit();
        break;
      /* istanbul ignore next */
      default:
        break;
    }
    return false;
  }

  resetSearch() {
    this.lastSearch = null;
    this.setState({ value: '', placeholder: '' });
    this.props.searchClearSuggestions();
    this.closeDropdown();
  }

  closeDropdown() {
    this.setState({ show: false });
  }

  selectInput() {
    this.inputRef.inputNode.select();
  }

  getDelegatesResults() {
    return this.props.results.delegates.map((delegate, idx) => ({
      id: delegate.address,
      valueLeft: delegate.username,
      valueRight: delegate.rank,
      isSelected: idx === this.state.selectedIdx,
      type: 'delegates',
    }));
  }

  getAddressesResults() {
    return this.props.results.addresses.map((account, idx) => ({
      id: account.address,
      valueLeft: account.address,
      valueRight: <span><LiskAmount val={account.balance}/> LSK</span>,
      isSelected: this.props.results.delegates.length + idx === this.state.selectedIdx,
      type: 'addresses',
    }));
  }

  getTransactionsResults() {
    return this.props.results.transactions.map((transaction, idx) => ({
      id: transaction.id,
      valueLeft: transaction.id,
      valueRight: transaction.height,
      isSelected: this.props.results.delegates.length +
      this.props.results.addresses.length + idx === this.state.selectedIdx,
      type: 'transactions',
    }));
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { history, t, value } = this.props;

    return (
      <div className={styles.wrapper}>
        <input value={this.state.placeholder}
          className={`${styles.placeholder} autosuggest-placeholder`}
          type='text'
          name='autosuggest-placeholder' />
        <Input type='text' placeholder={t('Search for delegate, Lisk ID, transaction ID')} name='searchBarInput'
          value={this.state.value}
          innerRef={(el) => { this.inputRef = el; }}
          className={`${styles.input} autosuggest-input`}
          theme={styles}
          onClick={this.selectInput.bind(this)}
          onBlur={this.closeDropdown.bind(this)}
          onKeyDown={this.handleKey.bind(this)}
          onChange={this.search.bind(this)}
          autoComplete='off'>
          {
            this.state.value !== '' ?
              <FontIcon value='close' className={`${styles.icon} autosuggest-btn-close`} onClick={this.resetSearch.bind(this)} /> :
              <FontIcon value='search' className={`${styles.icon} ${styles.iconSearch} autosuggest-btn-search`}
                onClick={this.submitSearch.bind(this)} />
          }
        </Input>
        <div className={`${styles.autoSuggest} ${this.state.show ? styles.show : ''} autosuggest-dropdown`}>
          <ResultsList
            key='delegates'
            results={this.getDelegatesResults()}
            header={{
              titleLeft: t('Delegate'),
              titleRight: t('Rank'),
            }}
            onMouseDown={this.onResultClick.bind(this)}
            setSelectedRow={this.setSelectedRow.bind(this)}
          />
          <ResultsList
            key='addresses'
            results={this.getAddressesResults()}
            header={{
              titleLeft: t('Address'),
              titleRight: t('Balance'),
            }}
            onMouseDown={this.onResultClick.bind(this)}
            setSelectedRow={this.setSelectedRow.bind(this)}
          />
          <ResultsList
            key='transactions'
            results={this.getTransactionsResults()}
            header={{
              titleLeft: t('Transaction'),
              titleRight: t('Height'),
            }}
            onMouseDown={this.onResultClick.bind(this)}
            setSelectedRow={this.setSelectedRow.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default AutoSuggest;
