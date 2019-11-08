import React from 'react';
import { BigNumber } from 'bignumber.js';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { tokenMap } from '../../../../constants/tokens';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import BoxFooterButton from '../../../toolbox/box/footerButton';
import BoxEmptyState from '../../../toolbox/box/emptyState';
import LiskAmount from '../../../shared/liskAmount';
import Illustration from '../../../toolbox/illustration';
import withResizeValues from '../../../../utils/withResizeValues';
import routes from '../../../../constants/routes';
import Table from '../../../toolbox/table';
import AccountVisualWithAddress from '../../../shared/accountVisualWithAddress';
import { DEFAULT_LIMIT } from '../../../../constants/monitor';
import { formatAmountBasedOnLocale } from '../../../../utils/formattedNumber';
import styles from './accountsTable.css';

class AccountsTable extends React.Component {
  handleLoadMore = () => {
    const { accounts } = this.props;
    accounts.loadData({ offset: accounts.data.length });
  }

  render() {
    const {
      accounts,
      isMediumViewPort,
      networkStatus,
      t,
      title,
    } = this.props;
    const supply = networkStatus.data.supply;

    return (
      <Box main isLoading={accounts.isLoading} className="accounts-box">
        <BoxHeader>
          <h1>{title}</h1>
        </BoxHeader>
        {
          accounts.error
            ? (
              <BoxContent>
                <BoxEmptyState>
                  <Illustration name="emptyWallet" />
                  <h3>{`${accounts.error}`}</h3>
                </BoxEmptyState>
              </BoxContent>
            )
            : (
              <React.Fragment>
                <BoxContent className={styles.content}>
                  <Table
                    getRowLink={account => `${routes.accounts.path}/${account.address}`}
                    data={accounts.data}
                    columns={[
                      {
                        header: t('Rank'),
                        className: `${grid['col-xs-1']} ${grid['col-md-1']}`,
                        id: 'rank',
                        getValue: () => (<span className={styles.counter} />),
                      },
                      {
                        header: t('Address'),
                        className: `${grid['col-xs-3']} ${grid['col-md-5']}`,
                        id: 'address',
                        getValue: account => (
                          <AccountVisualWithAddress
                            address={account.address}
                            isMediumViewPort={isMediumViewPort}
                            transactionSubject="address"
                            showBookmarkedAddress
                          />
                        ),
                      },
                      {
                        header: t('Balance'),
                        className: `${grid['col-xs-3']} ${grid['col-md-3']}`,
                        id: 'balance',
                        getValue: account => (
                          <LiskAmount val={account.balance} roundTo={0} token={tokenMap.LSK.key} />
                        ),
                      },
                      {
                        header: t('Supply'),
                        className: `${grid['col-xs-2']} ${grid['col-md-1']}`,
                        id: 'supply',
                        getValue: (account) => {
                          const amount = new BigNumber(account.balance / supply * 100);
                          return <span>{`${formatAmountBasedOnLocale({ value: amount.toFormat(2) })} %`}</span>;
                        },
                      },
                      {
                        header: t('Owner'),
                        className: `${grid['col-xs-3']} ${grid['col-md-2']}`,
                        id: 'owner',
                        getValue: (account) => {
                          const delegateUsername = account.delegate ? account.delegate.username : '';
                          const text = account.knowledge
                            && account.knowledge.owner && account.knowledge.description
                            ? `${account.knowledge.owner} ${account.knowledge.description}`
                            : delegateUsername;
                          return text;
                        },
                      },
                    ]}
                    rowClassName="accounts-row"
                    rowKey="address"
                  />
                </BoxContent>
                {
                  !!accounts.data.length
                  && accounts.data.length % DEFAULT_LIMIT === 0
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
  title: '',
};

export default withResizeValues(AccountsTable);
