import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'src/utils/helpers';
import { LayoutSchema } from '@views/configuration';
import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import TransactionDetailsContext from '@transaction/context/transactionDetailsContext';
import NotFound from './notFound';
import styles from './transactionDetails.css';

const TransactionDetails = ({ title }) => {
  const {
    schema, error, isLoading, transaction, containerStyle,
  } = React.useContext(TransactionDetailsContext);
  const { t } = useTranslation();
  const isDataEmpty = useMemo(() => isEmpty(transaction), [transaction]);

  if (!error && isDataEmpty) {
    return <div />;
  }
  if (error && isDataEmpty) {
    return <NotFound t={t} />;
  }

  const Layout = LayoutSchema[schema ?? transaction.moduleAssetId] || LayoutSchema.default;

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
      <Box className={`${styles.mainContent} ${Layout.className}`}>
        {Layout.components.map((Component, index) => (
          <Component key={index} t={t} />
        ))}
      </Box>
    </Box>
  );
};

export default TransactionDetails;
