import React from 'react';
import { Link } from 'react-router-dom';
import TransactionTypeFigure from '../../transactions/typeFigure/TransactionTypeFigure';
import TransactionAddress from '../../transactions/address/TransactionAddress';
import TransactionAmount from '../../transactions/amount/TransactionAmount';
import { SecondaryButton } from '../../toolbox/buttons/button';
import { tokenMap } from '../../../constants/tokens';
import routes from '../../../constants/routes';
import styles from './recentTransactions.css';

const TransactionList = ({
  account,
  bookmarks,
  activeToken,
  t,
  transactions,
}) => (
  <div className={`${styles.wrapper} recent-transactions-list-container`}>
    <header>
      <label>{t('Transactions')}</label>
      <label>{t('Amount')}</label>
    </header>
    <div className={styles.list}>
      {
      transactions.map(tx => (
        <Link
          key={tx.id}
          to={`${routes.transactions.pathPrefix}${routes.transactions.path}/${tx.id}`}
          className={`${styles.listRow} transactions-row`}
        >
          {
            activeToken === tokenMap.LSK.key
              ? (
                <TransactionTypeFigure
                  address={tx.recipientId}
                  transactionType={tx.type}
                />
              )
              : null
          }
          <TransactionAddress
            address={tx.recipientId}
            bookmarks={bookmarks}
            t={t}
            token={activeToken}
            transactionType={tx.type}
          />
          <TransactionAmount
            address={account.address}
            token={activeToken}
            transaction={tx}
          />
        </Link>
      ))
    }
    </div>
    <Link to={routes.wallet.path} className="view-all">
      <SecondaryButton className="small">{t('View All')}</SecondaryButton>
    </Link>
  </div>
);

export default TransactionList;
