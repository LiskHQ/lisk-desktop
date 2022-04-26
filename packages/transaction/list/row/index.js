import React from 'react';
import { withTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import { tokenMap } from '@token/configuration/tokens';
import { getTxAmount } from '@transaction/utilities/transaction';
import LayoutSchema from './layoutSchema';
import DialogLink from '@basics/dialog/link';
import styles from './schemas.css';

const roundSize = 103;

export const Context = React.createContext({
  data: {},
  host: '',
  currentBlockHeight: 0,
});

const TransactionRow = ({
  data, className, t, currentBlockHeight, host, layout, avatarSize,
}) => {
  const isPending = data.isPending;
  const senderAddress = data.sender.address;
  const recipientAddress = data.asset.recipient?.address;
  const amount = getTxAmount(data);

  const Layout = LayoutSchema[layout] || LayoutSchema.default;

  // @todo Fix hard coded token
  return (
    <DialogLink
      className={`${grid.row} ${styles.container} ${styles[layout]} ${className} transactions-row`}
      component="transactionDetails"
      data={{ transactionId: data.id, token: tokenMap.LSK.key }}
    >
      <Context.Provider value={{ currentBlockHeight, data, host, activeToken: tokenMap.LSK.key, avatarSize }}>
        {Layout.components.map((Component, index) => <Component key={index} t={t} />)}
      </Context.Provider>
    </DialogLink>
  );
};

/* istanbul ignore next */
const areEqual = (prevProps, nextProps) =>
  (prevProps.data.id === nextProps.data.id
  && prevProps.currentBlockHeight === nextProps.currentBlockHeight);

export default React.memo(withTranslation()(TransactionRow), areEqual);
