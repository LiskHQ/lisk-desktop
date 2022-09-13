import React from 'react';
import { isEmpty } from 'src/utils/helpers';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import BoxHeader from 'src/theme/box/header';
import TransactionDetailsContext from '@transaction/context/transactionDetailsContext';
import { LayoutSchema } from '../TransactionDetails/layoutSchema';
import layoutSchemaStyles from '../TransactionDetails/layoutSchema.css';
import NotFound from './notFound';
import styles from './styles.css';

const TransactionDetails = ({
  t, activeToken, network, title,
  transaction: { error, isLoading, data }, wallet,
  containerStyle,
}) => {
  if (!error && isEmpty(data)) {
    return <div />;
  }

  if (error && isEmpty(data)) {
    return <NotFound t={t} />;
  }

  const Layout = LayoutSchema[data.moduleCommand] || LayoutSchema.default;

  return (
    <Box
      isLoading={isLoading}
      className={`${styles.container} ${containerStyle}`}
    >
      {title && (
        <BoxHeader>
          <h1>{title}</h1>
        </BoxHeader>
      )}
      <Box>
        <BoxContent className={`${layoutSchemaStyles.mainContent} ${Layout.className}`}>
          <TransactionDetailsContext.Provider value={{
            activeToken, network, wallet, transaction: data,
          }}
          >
            {Layout.components.map((Component, index) => (
              <Component key={index} t={t} />
            ))}
          </TransactionDetailsContext.Provider>
        </BoxContent>
      </Box>
    </Box>
  );
};

export default TransactionDetails;
