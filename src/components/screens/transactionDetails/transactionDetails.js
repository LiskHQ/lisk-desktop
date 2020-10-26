import React, { useEffect } from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import Box from '../../toolbox/box';
import BoxHeader from '../../toolbox/box/header';
import BoxContent from '../../toolbox/box/content';
import NotFound from '../../shared/notFound';
import TransactionVotes from './transactionVotes';
import routes from '../../../constants/routes';
import { isEmpty } from '../../../utils/helpers';
import Dialog from '../../toolbox/dialog/dialog';

import {
  TransactionId, Sender, Recipient, Message, Illustration,
  Confirmations, Date, Amount, Fee, RequiredSignatures, Nonce,
} from './components';
import styles from './transactionDetails.css';
import transactionTypes from '../../../constants/transactionTypes';

const txTypes = transactionTypes();
const baseComponents = [Sender, Confirmations, TransactionId, Fee, Date, Nonce];
const LayoutSchema = {
  [txTypes.createMultiSig.code.legacy]: {
    components: [...baseComponents, Recipient, RequiredSignatures, Amount, Message],
    className: styles.multiSigLayout,
  },
  [txTypes.vote.code.legacy]: {
    components: [...baseComponents, TransactionVotes],
    className: styles.voteLayout,
  },
  [txTypes.transfer.code.legacy]: {
    components: [...baseComponents, Recipient, Illustration, Amount, Message],
    className: '',
  },
  [txTypes.registerDelegate.code.legacy]: {
    components: [...baseComponents, Illustration],
    className: styles.registerDelegate,
  },
  default: {
    components: [...baseComponents],
    className: styles.generalLayout,
  },
};

export const Context = React.createContext({
  transaction: {},
});

const TransactionDetails = ({
  t, activeToken, netCode, delegates, history,
  transaction: { error, isLoading, data },
}) => {
  useEffect(() => {
    // history.push(routes.dashboard.path);
  }, [activeToken]);


  if (!error && isEmpty(data)) {
    return <div />;
  }

  if (error && isEmpty(data)) {
    return <NotFound />;
  }

  const Layout = LayoutSchema[4] || LayoutSchema.default;

  return (
    <Dialog hasClose className={`${grid.row} ${grid['center-xs']} ${styles.container}`}>
      <Box isLoading={isLoading} className={styles.wrapper}>
        <BoxHeader>
          <h1>{t('Transaction details')}</h1>
        </BoxHeader>
        <BoxContent className={`${styles.mainContent} ${Layout.className}`}>
          <Context.Provider value={{
            transaction: data, activeToken, netCode, delegates,
          }}
          >
            {Layout.components.map((Component, index) => <Component key={index} t={t} />)}
          </Context.Provider>
        </BoxContent>
      </Box>
    </Dialog>
  );
};

export default TransactionDetails;
