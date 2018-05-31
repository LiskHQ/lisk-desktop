import React from 'react';
import Input from 'react-toolbox/lib/input';
import styles from './autoSuggest.css';
import LiskAmount from './../liskAmount';
import routes from './../../constants/routes';
import keyCodes from './../../constants/keyCodes';
import mockSearchResults from './searchResults.mock';

let searchResults = mockSearchResults;
class AutoSuggest extends React.Component {
  constructor(props) {
    super(props);

    searchResults = this.props.results || searchResults;

    this.delegatesPropsMap = {
      uniqueKey: 'address',
      redirectPath: entity => `${routes.accounts.pathPrefix}${routes.accounts.path}/${entity.address}`,
      keyHeader: 'username',
      keyValue: entity => (<span>{entity.rank}</span>),
      i18Header: this.props.t('Delegate'),
      i18Value: this.props.t('Rank'),
    };

    this.addressesPropsMap = {
      uniqueKey: 'address',
      redirectPath: entity => `${routes.accounts.pathPrefix}${routes.accounts.path}/${entity.address}`,
      keyHeader: 'address',
      keyValue: entity => (<span><LiskAmount val={entity.balance}/> LSK</span>),
      i18Header: this.props.t('Address'),
      i18Value: this.props.t('Balance'),
    };

    this.transactionsPropsMap = {
      uniqueKey: 'id',
      redirectPath: entity => `${routes.transactions.pathPrefix}${routes.transactions.path}/${entity.id}`,
      keyHeader: 'id',
      keyValue: entity => (<span>{entity.height}</span>),
      i18Header: this.props.t('Transaction'),
      i18Value: this.props.t('Height'),
    };

    let resultsLength = 0;
    Object.keys(searchResults).map((resultKey) => {
      resultsLength += searchResults[resultKey].length;
      return resultsLength;
    });

    this.selectedRow = null;

    this.state = {
      show: false,
      selectedIdx: 0,
      resultsLength,
    };
  }

  submitSearch(urlSearch) {
    this.closeDropdown();
    this.inputRef.blur();
    if (!urlSearch) {
      this.selectedRow.click();
      return;
    }
    this.props.history.push(urlSearch);
  }

  /* eslint-disable class-methods-use-this,no-unused-vars */
  search(searchTerm) {
    if (!this.state.show) this.setState({ show: true });
  }
  /* eslint-enable class-methods-use-this,no-unused-vars */

  handleArrowDown() {
    let currentIdx = this.state.selectedIdx;
    currentIdx = (currentIdx === this.resultsLength) ? this.resultsLength : currentIdx += 1;
    this.setState({ selectedIdx: currentIdx });
  }

  handleArrowUp() {
    let currentIdx = this.state.selectedIdx;
    currentIdx = (currentIdx === 0) ? 0 : currentIdx -= 1;
    this.setState({ selectedIdx: currentIdx });
  }

  handleBlur() {
    this.closeDropdown();
  }

  handleFocus() {
    this.showDropdown();
  }

  handleKey(event) {
    switch (event.keyCode) {
      case keyCodes.arrowDown :
        this.handleArrowDown();
        break;
      case keyCodes.arrowUp :
        this.handleArrowUp();
        break;
      case keyCodes.escape :
        this.closeDropdown();
        break;
      case keyCodes.enter :
        this.submitSearch();
        break;
      case keyCodes.tab :
        this.submitSearch();
        break;
      default:
        break;
    }
    return false;
  }

  closeDropdown() {
    this.setState({ show: false });
  }

  showDropdown() {
    this.setState({ show: true });
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { history, t, results } = this.props;

    const renderEntities = ({
      entities,
      entityKey,
      uniqueKey,
      redirectPath,
      keyHeader,
      keyValue,
      i18Header,
      i18Value,
      entityIdxStart,
      selectedIdx,
    }) => {
      const targetRows = entities.map((entity, idx) => {
        const isSelectedRow = selectedIdx === entityIdxStart + idx;
        let rowProps = {
          onClick: this.submitSearch.bind(this, redirectPath(entity)),
          className: `${styles.row} ${styles.rowResult} ${isSelectedRow ? styles.rowSelected : ''} ${entityKey}-result`,
        };
        if (isSelectedRow) {
          rowProps = { ...rowProps, ref: (el) => { this.selectedRow = el; } };
        }
        return <li {...rowProps} key={entity[uniqueKey]}>
          <span>{entity[keyHeader]}</span>
          {
            keyValue(entity)
          }
        </li>;
      });
      return <ul className={styles.resultList} key={entityKey}>
        <li className={`${styles.row} ${styles.heading} ${entityKey}-header`}>
          <span>{i18Header}</span>
          <span>{i18Value}</span>
        </li>
        {targetRows}
      </ul>;
    };

    const delegatesResults = searchResults.delegates || [];
    const addressesResults = searchResults.addresses || [];
    const transactionsResults = searchResults.transactions || [];

    return (
      <div className={styles.wrapper}>
        <Input type='text' placeholder={t('Search delegates, addresses')} name='searchBarInput'
          innerRef={(el) => { this.inputRef = el; }}
          className={`${styles.input} autosuggest-input`}
          theme={styles}
          onFocus={this.handleFocus.bind(this)}
          onKeyDown={this.handleKey.bind(this)}
          onChange={this.search.bind(this)}
          autoComplete='off' />
        <div className={`${styles.autoSuggest} ${this.state.show ? styles.show : ''} autosuggest-dropdown`}
          onMouseLeave={this.handleBlur.bind(this)}>
          {
            delegatesResults.length > 0 ?
              renderEntities({
                entities: delegatesResults,
                entityKey: 'delegates',
                entityIdxStart: 0,
                selectedIdx: this.state.selectedIdx,
                ...this.delegatesPropsMap,
              }) : null
          }
          {
            addressesResults.length > 0 ?
              renderEntities({
                entities: addressesResults,
                entityKey: 'addresses',
                entityIdxStart: delegatesResults.length,
                selectedIdx: this.state.selectedIdx,
                ...this.addressesPropsMap,
              }) : null
          }
          {
            transactionsResults.length > 0 ?
              renderEntities({
                entities: transactionsResults,
                entityKey: 'transactions',
                entityIdxStart: delegatesResults.length + addressesResults.length,
                selectedIdx: this.state.selectedIdx,
                ...this.transactionsPropsMap,
              }) : null
          }
        </div>
      </div>
    );
  }
}

export default AutoSuggest;
