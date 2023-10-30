import React from 'react';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useNetworkSupportedTokens } from '@token/fungible/hooks/queries';
import routes from 'src/routes/routes';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { useCurrentApplication } from '@blockchainApplication/manage/hooks';
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
  validators,
  address,
  isWallet,
}) => {
  const Layout = LayoutSchema[layout] || LayoutSchema.default;
  const [currentApplication] = useCurrentApplication();
  const networkSupportedTokens = useNetworkSupportedTokens(currentApplication);

  const token =
    networkSupportedTokens.data?.find(({ chainID }) => chainID === currentApplication.chainID) ||
    {};

  return (
    <Link
      className={`${grid.row} ${styles.container} ${styles[layout]} ${className} transactions-row`}
      to={`${routes.transactionDetails.path}?transactionID=${data.id}`}
    >
      <TransactionRowContext.Provider
        value={{
          currentBlockHeight,
          data,
          host,
          activeToken,
          avatarSize,
          validators,
          address,
          token,
        }}
      >
        {Layout.components.map((Component, index) => (
          <Component key={index} t={t} isWallet={isWallet} />
        ))}
      </TransactionRowContext.Provider>
    </Link>
  );
};

/* istanbul ignore next */
const areEqual = (prevProps, nextProps) =>
  prevProps.data.id === nextProps.data.id &&
  prevProps.currentBlockHeight === nextProps.currentBlockHeight;

export default React.memo(withTranslation()(TransactionRow), areEqual);
