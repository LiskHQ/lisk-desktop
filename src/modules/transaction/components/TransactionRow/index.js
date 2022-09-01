import React from 'react';
import { withTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import DialogLink from 'src/theme/dialog/link';
import LayoutSchema from './layoutSchema';
import TransactionRowContext from '../../context/transactionRowContext';
import styles from './schemas.css';

const TransactionRow = ({
  data,
  className,
  t,
  currentBlockHeight,
  host,
  layout,
  avatarSize,
  activeToken,
  delegates,
}) => {
  const Layout = LayoutSchema[layout] || LayoutSchema.default;

  return (
  // <div className="transaction-row-wrapper">
    <DialogLink
      className={`${grid.row} ${styles.container} ${styles[layout]} ${className} transactions-row`}
      component="transactionDetails"
      data={{ transactionId: data.id, token: activeToken }}
    >
      <TransactionRowContext.Provider
        value={{
          currentBlockHeight,
          data,
          host,
          activeToken,
          avatarSize,
          delegates,
        }}
      >
        {Layout.components.map((Component, index) => (
          <Component key={index} t={t} />
        ))}
      </TransactionRowContext.Provider>
    </DialogLink>
  // </div>
  );
};

/* istanbul ignore next */
const areEqual = (prevProps, nextProps) =>
  prevProps.data.id === nextProps.data.id
  && prevProps.currentBlockHeight === nextProps.currentBlockHeight;

export default React.memo(withTranslation()(TransactionRow), areEqual);
