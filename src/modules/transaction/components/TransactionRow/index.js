import React, { createContext } from 'react';
import { withTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import DialogLink from '@basics/dialog/link';
import LayoutSchema from './layoutSchema';
import styles from './schemas.css';

export const RowContext = createContext({
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
      data={{ transactionId: data.id, token: activeToken }}
    >
      <RowContext.Provider value={{
        currentBlockHeight, data, host, activeToken, avatarSize,
      }}
      >
        {Layout.components.map((Component, index) => <Component key={index} t={t} />)}
      </RowContext.Provider>
    </DialogLink>
  );
};

/* istanbul ignore next */
const areEqual = (prevProps, nextProps) =>
  (prevProps.data.id === nextProps.data.id
  && prevProps.currentBlockHeight === nextProps.currentBlockHeight);

export default React.memo(withTranslation()(TransactionRow), areEqual);
