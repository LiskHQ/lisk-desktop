import React from 'react';
import { Link } from 'react-router-dom';
import TransactionTypeFigure from '../../wallet/transactions/typeFigure/TransactionTypeFigure';
import TransactionAddress from '../../../shared/transactionAddress/TransactionAddress';
import TransactionAmount from '../../wallet/transactions/amount/TransactionAmount';
import { SecondaryButton } from '../../../toolbox/buttons/button';
import routes from '../../../../constants/routes';
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
          <div className={styles.avatarAndAddress}>
            <TransactionTypeFigure
              address={account.address === tx.recipientId ? tx.senderId : tx.recipientId}
              transactionType={tx.type}
            />
            <TransactionAddress
              address={account.address === tx.recipientId ? tx.senderId : tx.recipientId}
              bookmarks={bookmarks}
              t={t}
              token={activeToken}
              transactionType={tx.type}
            />
          </div>
          <TransactionAmount
            host={account.address}
            token={activeToken}
            transaction={tx}
            sender={tx.senderId}
            type={tx.type}
            recipient={tx.recipientId || tx.asset.recipientId}
            roundTo={2}
            amount={tx.amount || tx.asset.amount}
          />
        </Link>
      ))
    }
    </div>
    <Link to={routes.wallet.path} className="view-all">
      <SecondaryButton size="s">{t('View All')}</SecondaryButton>
    </Link>
  </div>
);

export default TransactionList;
