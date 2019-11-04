import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { tokenMap } from '../../../constants/tokens';
import Box from '../../toolbox/box';
import BoxHeader from '../../toolbox/box/header';
import BoxContent from '../../toolbox/box/content';
import BoxFooterButton from '../../toolbox/box/footerButton';
import BoxEmptyState from '../../toolbox/box/emptyState';
import LiskAmount from '../liskAmount';
import Illustration from '../../toolbox/illustration';
import withResizeValues from '../../../utils/withResizeValues';
import routes from '../../../constants/routes';
import Table from '../../toolbox/table';
import AccountVisualWithAddress from '../accountVisualWithAddress';
import { DEFAULT_LIMIT } from '../../../constants/monitor';
import styles from './accountsTable.css';

class AccountsTable extends React.Component {
  handleLoadMore = () => {
    const { transactions } = this.props;
    transactions.loadData({ offset: transactions.data.length });
  }

  render() {
    const {
      title,
      transactions,
      isLoadMoreEnabled,
      t,
      emptyStateMessage,
      isMediumViewPort,
    } = this.props;

    return (
      <Box main isLoading={transactions.isLoading} className="transactions-box">
        <BoxHeader>
          <h1>{title}</h1>
        </BoxHeader>
        {
          transactions.error
            ? (
              <BoxContent>
                <BoxEmptyState>
                  <Illustration name="emptyWallet" />
                  <h3>{emptyStateMessage || `${transactions.error}`}</h3>
                </BoxEmptyState>
              </BoxContent>
            )
            : (
              <React.Fragment>
                <BoxContent className={styles.content}>
                  <Table
                    getRowLink={transaction => `${routes.accounts.path}/${transaction.id}`}
                    data={transactions.data}
                    columns={[
                      {
                        header: t('Rank'),
                        className: grid['col-xs-1'],
                        id: 'rank',
                        getValue: () => (<span># Rank</span>),
                      },
                      {
                        header: t('Address'),
                        className: grid['col-xs-5'],
                        id: 'address',
                        getValue: transaction => (
                          <AccountVisualWithAddress
                            address={transaction.recipientId}
                            isMediumViewPort={isMediumViewPort}
                            transactionSubject="address"
                            transactionType={transaction.type}
                            showBookmarkedAddress
                          />
                        ),
                      },
                      {
                        header: t('Balance'),
                        className: grid['col-xs-2'],
                        id: 'balance',
                        getValue: transaction => (
                          <LiskAmount val={transaction.amount} token={tokenMap.LSK.key} />
                        ),
                      },
                      {
                        header: t('Supply'),
                        className: grid['col-xs-2'],
                        id: 'supply',
                        getValue: () => (<span>supply</span>),
                      },
                      {
                        header: t('Owner'),
                        className: grid['col-xs-2'],
                        id: 'owner',
                        getValue: () => (<span>description</span>),
                      },
                    ]}
                  />
                </BoxContent>
                {
                  isLoadMoreEnabled && !!transactions.data.length
                  && transactions.data.length % DEFAULT_LIMIT === 0
                    ? (
                      <BoxFooterButton className="load-more" onClick={this.handleLoadMore}>
                        {t('Load more')}
                      </BoxFooterButton>
                    )
                    : null
                }
              </React.Fragment>
            )
        }
      </Box>
    );
  }
}

AccountsTable.defaultProps = {
  isLoadMoreEnabled: false,
  title: '',
  emptyStateMessage: '',
};

export default withResizeValues(AccountsTable);
