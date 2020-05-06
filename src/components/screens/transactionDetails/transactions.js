import { withTranslation } from 'react-i18next';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { SecondaryButton } from '../../toolbox/buttons/button';
import Box from '../../toolbox/box';
import BoxHeader from '../../toolbox/box/header';
import BoxContent from '../../toolbox/box/content';
import CopyToClipboard from '../../toolbox/copyToClipboard';
import NotFound from '../../shared/notFound';
import TransactionVotes from './transactionVotes';
import routes from '../../../constants/routes';
import {
  DateAndConfirmation, FeeAndAmount, TransactionId,
  Sender, Recipient, Message, Illustration,
} from './dataRows';
import styles from './transactions.css';

function addVotesWithDelegateNames(transaction, delegates, t) {
  const getVotesStartingWith = sign => (
    transaction.asset.votes
      .filter(item => item.startsWith(sign))
      .map(item => item.replace(sign, ''))
  );

  const getDelegate = publicKey => (
    delegates[publicKey] || { username: t('Loading name...'), account: {} }
  );

  if (transaction.asset && transaction.asset.votes) {
    transaction.votesName = {
      added: getVotesStartingWith('+').map(getDelegate),
      deleted: getVotesStartingWith('-').map(getDelegate),
    };
  }
  return transaction;
}

class Transactions extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.activeToken !== prevProps.activeToken) {
      this.props.history.push(routes.dashboard.path);
    }
    if (prevProps.transaction.isLoading && !this.props.transaction.isLoading) {
      this.fetchDelegates();
    }
  }

  fetchDelegates() {
    const { transaction, delegates } = this.props;
    if (transaction.data.asset && transaction.data.asset.votes) {
      transaction.data.asset.votes
        .forEach(publicKey => delegates.loadData({ publicKey: publicKey.substring(1) }));
    }
  }

  getLinkToCopy() {
    return {
      LSK: `lisk:/${this.props.match.url}`,
      BTC: this.props.transaction.data.explorerLink,
    }[this.props.activeToken];
  }

  render() {
    const {
      t, activeToken, delegates, netCode,
    } = this.props;
    const transaction = addVotesWithDelegateNames(this.props.transaction.data, delegates.data, t);
    const { error, isLoading } = this.props.transaction;
    const addresses = transaction && [transaction.recipientId, transaction.senderId];

    return (
      <div className={`${grid.row} ${grid['center-xs']} ${styles.container}`}>
        { !error ? (
          <Box width="medium" isLoading={isLoading}>
            <BoxHeader>
              <h1>{t('Transaction details')}</h1>
              <CopyToClipboard
                value={this.getLinkToCopy()}
                text={t('Copy link')}
                Container={SecondaryButton}
                containerProps={{ size: 'xs' }}
                copyClassName={styles.copyIcon}
              />
            </BoxHeader>
            <BoxContent className={styles.mainContent}>
              <Illustration transaction={transaction} />
              <Sender
                transaction={transaction}
                activeToken={activeToken}
                netCode={netCode}
              />
              <Recipient
                transaction={transaction}
                activeToken={activeToken}
                netCode={netCode}
                t={t}
              />
              <DateAndConfirmation
                transaction={transaction}
                activeToken={activeToken}
                addresses={addresses}
                t={t}
              />
              <TransactionId t={t} id={transaction.id} />
              <FeeAndAmount
                transaction={transaction}
                activeToken={activeToken}
                addresses={addresses}
                t={t}
              />
              <Message activeToken={activeToken} transaction={transaction} t={t} />
              <TransactionVotes transaction={transaction} t={t} />
            </BoxContent>
          </Box>
        ) : (
          <NotFound />
        ) }
      </div>
    );
  }
}

export default withTranslation()(Transactions);
