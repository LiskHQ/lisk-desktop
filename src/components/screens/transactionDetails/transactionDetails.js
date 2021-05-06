import React, { useRef, useEffect } from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { isEmpty } from '@utils/helpers';
import Box from '@toolbox/box';
import BoxHeader from '@toolbox/box/header';
import BoxContent from '@toolbox/box/content';
import NotFound from '@shared/notFound';
import Dialog from '@toolbox/dialog/dialog';
import routes from '@src/routes';
import styles from './transactionDetails.css';
import LayoutSchema from './layoutSchema';

export const Context = React.createContext({
  transaction: {},
});

const TransactionDetails = ({
  t, activeToken, network, history,
  transaction: { error, isLoading, data },
}) => {
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (!isFirstRender.current) {
      history.push(routes.dashboard.path);
    }
  }, [activeToken]);

  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  if (!error && isEmpty(data)) {
    return <div />;
  }

  if (error && isEmpty(data)) {
    return <NotFound />;
  }

  const Layout = LayoutSchema[data.moduleAssetId] || LayoutSchema.default;

  return (
    <Dialog hasClose className={`${grid.row} ${grid['center-xs']} ${styles.container}`}>
      <Box isLoading={isLoading} className={styles.wrapper}>
        <BoxHeader>
          <h1>{t('Transaction details')}</h1>
        </BoxHeader>
        <BoxContent className={`${styles.mainContent} ${Layout.className}`}>
          <Context.Provider value={{
            transaction: data, activeToken, network,
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
