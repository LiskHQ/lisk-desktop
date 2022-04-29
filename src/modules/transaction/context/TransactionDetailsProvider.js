import React from 'react';
import TransactionDetailsContext from './transactionDetailsContext';

function TransactionDetailsProvider({
  activeToken,
  network,
  schema,
  transaction: { error, isLoading, data },
  account,
  containerStyle,
  children,
}) {
  return (
    <TransactionDetailsContext.Provider value={{
      error,
      schema,
      network,
      account,
      isLoading,
      activeToken,
      containerStyle,
      transaction: data,
    }}
    >
      {children}
    </TransactionDetailsContext.Provider>
  );
}

export default TransactionDetailsProvider;
