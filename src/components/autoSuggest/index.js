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
  submitSearch(urlSearch) {
    this.props.history.push(urlSearch);
  }

  /* eslint-disable class-methods-use-this */
  handleKey() {}
  handleBlur() {}
  search() {}
  /* eslint-enable class-methods-use-this */

  render() {
    // eslint-disable-next-line no-unused-vars
    const { history, t, results } = this.props;

    const renderDelegates = (delegates) => {
      const delegatesRows = delegates.map(delegate =>
        <li
          onClick={this.submitSearch.bind(this,
            `${routes.accounts.pathPrefix}${routes.accounts.path}/${delegate.address}`,
          )}
          className={styles.row} key={delegate.address}>
          <span>{delegate.username}</span>
          <span>{delegate.rank}</span>
        </li>);
      return <ul className={styles.resultList} key='delegates'>
        <li className={`${styles.row} ${styles.heading}`}>
          <span>{t('Delegate')}</span>
          <span>{t('Rank')}</span>
        </li>
        {delegatesRows}
      </ul>;
    };

    const renderAddresses = (addresses) => {
      const addressesRows = addresses.map(account =>
        <li
          onClick={this.submitSearch.bind(this,
            `${routes.accounts.pathPrefix}${routes.accounts.path}/${account.address}`,
          )}
          className={styles.row} key={account.address}>
          <span>{account.address}</span>
          <span>{account.balance}</span>
        </li>);
      return <ul className={styles.resultList} key='addresses'>
        <li className={`${styles.row} ${styles.heading}`}>
          <span>{t('Address')}</span>
          <span>{t('Balance')}</span>
        </li>
        {addressesRows}
      </ul>;
    };

    return (
      <div className={styles.wrapper}>
        <Input type='text' placeholder={t('Search delegates, addresses')} name='searchBarInput'
          className={styles.input}
          theme={styles}
          onBlur={this.handleBlur.bind(this)}
          onKeyDown={this.handleKey.bind(this)}
          onChange={this.search.bind(this)}
          autoComplete='off' />
        <div className={styles.autoSuggest}>
          {
            resultsEntities.map((entity) => {
              switch (entity) {
                case resultsEntities[0] :
                  return renderDelegates(searchResults[entity]);
                case resultsEntities[1] :
                  return renderAddresses(searchResults[entity]);
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
