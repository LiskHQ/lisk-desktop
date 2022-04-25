import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { isEmpty } from '@common/utilities/helpers';
import Box from '@basics/box';
import BoxHeader from '@basics/box/header';
import BoxContent from '@basics/box/content';
import TransactionDetailsContext from '@transaction/configuration/context';
import NotFound from './notFound';
import styles from './transactionDetails.css';
import LayoutSchema from './layoutSchema';

const TransactionDetails = ({ title }) => {
  const {
    schema,
    error,
    isLoading,
    transaction,
    containerStyle,
  } = React.useContext(TransactionDetailsContext);
  const { t } = useTranslation();
  const isDataEmpty = useMemo(() => isEmpty(transaction), [transaction]);

  console.log('>>> ', isDataEmpty, schema,
    error,
    isLoading,
    transaction,
    containerStyle);

  if (!error && isDataEmpty) {
    return <div />;
  }
  if (error && isDataEmpty) {
    return <NotFound t={t} />;
  }

  const Layout = LayoutSchema[schema ?? transaction.moduleAssetId] || LayoutSchema.default;

  return (
    <Box isLoading={isLoading} className={`${styles.container} ${containerStyle}`}>
      {title && (
        <BoxHeader>
          <h1>{title}</h1>
        </BoxHeader>
      )}
      <BoxContent className={`${styles.mainContent} ${Layout.className}`}>
        {Layout.components.map((Component, index) => <Component key={index} t={t} />)}
      </BoxContent>
    </Box>
  );
};

export default TransactionDetails;
