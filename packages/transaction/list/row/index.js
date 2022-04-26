import React from 'react';
import { withTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import LayoutSchema from './layoutSchema';
import DialogLink from '@basics/dialog/link';
import styles from './schemas.css';

export const Context = React.createContext({
  data: {},
  host: '',
  currentBlockHeight: 0,
});

const TransactionRow = ({
  data, className, t, currentBlockHeight, host, layout, avatarSize, activeToken,
}) => {
  const Layout = LayoutSchema[layout] || LayoutSchema.default;

  return (
    <DialogLink
      className={`${grid.row} ${styles.container} ${styles[layout]} ${className} transactions-row`}
      component="transactionDetails"
      data={{ transactionId: data.id, token: activeToken}}
    >
      <Context.Provider value={{ currentBlockHeight, data, host, activeToken, avatarSize }}>
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
