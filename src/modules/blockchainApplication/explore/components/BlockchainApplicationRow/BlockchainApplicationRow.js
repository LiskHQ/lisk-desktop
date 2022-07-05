import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import DialogLink from 'src/theme/dialog/link';
import TokenAmount from 'src/modules/token/fungible/components/tokenAmount';
import { useTranslation } from 'react-i18next';
import liskLogo from '../../../../../../setup/react/assets/images/LISK.png';
import styles from './BlockchainApplicationRow.css';

const DepositAmount = ({ amount }) => (
  <span className={`${styles.amount} ${grid['col-xs-3']}`}>
    <TokenAmount val={amount} token="LSK" />
  </span>
);

const ChainId = ({ id }) => (
  <span className={`${styles.chainId} ${grid['col-xs-3']}`}>
    <span>{id}</span>
  </span>
);

const ChainStatus = ({ status, t }) => (
  <span className={grid['col-xs-2']}>
    <span className={`${styles.statusChip} ${styles[status]}`}>
      {t(status)}
    </span>
  </span>
);

const ChainName = ({ title, logo }) => (
  <span className={`${grid['col-xs-4']} ${styles.chainName}`}>
    <img src={logo} />
    {title}
  </span>
);

const BlockchainApplicationRow = ({
  data,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <div className="transaction-row-wrapper">
      <DialogLink
        className={`${grid.row} ${styles.container} ${className} blockchain-application-row`}
        component="blockchainApplicationDetails"
        data={{ chainId: data.chainID }}
      >
        <ChainName title={data.name} logo={liskLogo} />
        <ChainId id={data.chainID} />
        <ChainStatus status={data.state} t={t} />
        <DepositAmount amount={4000000} />
      </DialogLink>
    </div>
  );
};

export default BlockchainApplicationRow;
