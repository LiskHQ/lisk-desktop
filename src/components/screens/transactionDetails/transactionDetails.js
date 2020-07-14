import { withTranslation } from 'react-i18next';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Box from '../../toolbox/box';
import BoxHeader from '../../toolbox/box/header';
import BoxContent from '../../toolbox/box/content';
import NotFound from '../../shared/notFound';
import TransactionVotes from './transactionVotes';
import routes from '../../../constants/routes';
import {
  DateAndConfirmation, FeeAndAmount, TransactionId,
  Sender, Recipient, Message, Illustration,
} from './dataRows';
import { isEmpty } from '../../../utils/helpers';
import Dialog from '../../toolbox/dialog/dialog';
import styles from './transactionDetails.css';

class Transactions extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.activeToken !== prevProps.activeToken) {
      this.props.history.push(routes.dashboard.path);
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
      t, activeToken, netCode, transaction, delegates,
    } = this.props;
    const { error, isLoading, data } = transaction;
    const addresses = data && [data.recipientId, data.senderId];

    if (!error && isEmpty(transaction.data)) return <div />;
    if (error && isEmpty(transaction.data)) return <NotFound />;

    return (
      <Dialog hasClose className={`${grid.row} ${grid['center-xs']} ${styles.container}`}>
        <Box width="medium" isLoading={isLoading} className={styles.wrapper}>
          <BoxHeader>
            <h1>{t('Transaction details')}</h1>
          </BoxHeader>
          <BoxContent className={styles.mainContent}>
            <Illustration transaction={data} />
            <Sender
              transaction={data}
              activeToken={activeToken}
              netCode={netCode}
            />
            <Recipient
              transaction={data}
              activeToken={activeToken}
              netCode={netCode}
              t={t}
            />
            <DateAndConfirmation
              transaction={data}
              activeToken={activeToken}
              addresses={addresses}
              t={t}
            />
            <TransactionId t={t} id={data.id} />
            <FeeAndAmount
              transaction={data}
              activeToken={activeToken}
              addresses={addresses}
              t={t}
            />
            <Message activeToken={activeToken} transaction={data} t={t} />
            <TransactionVotes transaction={data} t={t} delegates={delegates} />
          </BoxContent>
        </Box>
      </Dialog>
    );
  }
}

export default withTranslation()(Transactions);
