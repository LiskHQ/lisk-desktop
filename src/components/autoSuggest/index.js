import React from 'react';
import Input from 'react-toolbox/lib/input';
import { translate } from 'react-i18next';
import styles from './autoSuggest.css';
import routes from './../../constants/routes';

const resultsEntities = [
  'delegates',
  'addresses',
  'transactions',
];

const searchResults =
  {
    addresses: [
      {
        address: '12334',
        balance: 9999,
      }, {
        address: '1233456',
        balance: 999,
      }, {
        address: '12334567',
        balance: 99,
      },
    ],
    delegates: [
      {
        username: 'peter',
        rank: 73,
        address: '123456',
      }, {
        username: 'peter2',
        rank: 76,
        address: '1234567',
      }, {
        username: 'peter4',
        rank: 77,
        address: '12345678',
      },
    ],
    transactions: [
      {
        id: '1234',
        height: 56,
      }, {
        id: '12345',
        height: 57,
      }, {
        id: '123456',
        height: 58,
      },
    ],
  };

class AutoSuggest extends React.Component {
  constructor(props) {
    super(props);

    let resultsLength = 0;
    Object.keys(searchResults).map((resultKey) => {
      resultsLength += searchResults[resultKey].length;
      return resultsLength;
    });

    this.state = {
      show: false,
      selectedIdx: 0,
      resultsLength,
    };
  }
  submitSearch(urlSearch) {
    this.props.history.push(urlSearch);
  }

  /* eslint-disable class-methods-use-this,no-unused-vars */
  search(searchTerm) {
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
    setTimeout(() => this.closeDropdown(), 100);
  }
  handleFocus() {
    this.showDropdown();
  }

  handleKey(event) {
    switch (event.keyCode) {
      case 40: // arrow down
        this.handleArrowDown();
        break;
      case 38: // arrow up
        this.handleArrowUp();
        break;
      case 27 : // escape
        this.closeDropdown();
        break;
      case 13 : // enter
        break;
      case 9 : // tab
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
      const targetRows = entities.map((entity, idx) =>
        <li
          onClick={this.submitSearch.bind(this,
            `${redirectPath}${entity[uniqueKey]}`,
          )}
          className={`${styles.row} ${selectedIdx === entityIdxStart + idx ? styles.rowSelected : ''}`}
          key={entity[uniqueKey]}>
          <span>{entity[keyHeader]}</span>
          <span>{entity[keyValue]}</span>
        </li>);
      return <ul className={styles.resultList} key={entityKey}>
        <li className={`${styles.row} ${styles.heading}`}>
          <span>{i18Header}</span>
          <span>{i18Value}</span>
        </li>
        {targetRows}
      </ul>;
    };

    const delegatesPropsMap = {
      uniqueKey: 'address',
      redirectPath: `${routes.accounts.pathPrefix}${routes.accounts.path}/`,
      keyHeader: 'username',
      keyValue: 'rank',
      i18Header: t('Delegate'),
      i18Value: t('Rank'),
    };

    const addressesPropsMap = {
      uniqueKey: 'address',
      redirectPath: `${routes.accounts.pathPrefix}${routes.accounts.path}/`,
      keyHeader: 'address',
      keyValue: 'balance',
      i18Header: t('Address'),
      i18Value: t('Balance'),
    };

    const transactionsPropsMap = {
      uniqueKey: 'id',
      redirectPath: `${routes.wallet.path}?id=`,
      keyHeader: 'id',
      keyValue: 'height',
      i18Header: t('Transaction'),
      i18Value: t('Height'),
    };

    return (
      <div className={styles.wrapper}>
        <Input type='text' placeholder={t('Search delegates, addresses')} name='searchBarInput'
          className={styles.input}
          theme={styles}
          onFocus={this.handleFocus.bind(this)}
          onBlur={this.handleBlur.bind(this)}
          onKeyDown={this.handleKey.bind(this)}
          onChange={this.search.bind(this)}
          autoComplete='off' />
        <div className={`${styles.autoSuggest} ${this.state.show ? styles.show : ''}`}>
          {
            resultsEntities.map((entity) => {
              switch (entity) {
                case resultsEntities[0] :
                  return renderEntities({
                    entities: searchResults[entity],
                    entityKey: entity,
                    entityIdxStart: 0,
                    selectedIdx: this.state.selectedIdx,
                    ...delegatesPropsMap,
                  });
                case resultsEntities[1] :
                  return renderEntities({
                    entities: searchResults[entity],
                    entityKey: entity,
                    entityIdxStart: searchResults.delegates.length,
                    selectedIdx: this.state.selectedIdx,
                    ...addressesPropsMap,
                  });
                case resultsEntities[2] :
                  return renderEntities({
                    entities: searchResults[entity],
                    entityKey: entity,
                    entityIdxStart: searchResults.delegates.length + searchResults.addresses.length,
                    selectedIdx: this.state.selectedIdx,
                    ...transactionsPropsMap,
                  });
                default:
              }
              return null;
            })
          }
        </div>
      </div>
    );
  }
}

export default translate()(AutoSuggest);
