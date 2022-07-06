import React from 'react';
import { useTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import DialogLink from 'src/theme/dialog/link';
import TokenAmount from 'src/modules/token/fungible/components/tokenAmount';
import liskLogo from '../../../../../../setup/react/assets/images/LISK.png';
import styles from './BlockchainApplicationRow.css';

const DepositAmount = ({ amount }) => (
  <span className={`${styles.amount} ${grid['col-xs-3']}`}>
    <TokenAmount val={amount} token="LSK" />
  </span>
);

const ChainId = ({ id }) => (
  <div className={`${styles.chainId} ${grid['col-xs-3']}`}>
    <span>{id}</span>
  </div>
);

const ChainStatus = ({ status, t }) => (
  <div className={grid['col-xs-2']}>
    <span className={`${styles.statusChip} ${styles[status]}`}>
      {t(status)}
    </span>
  </div>
);

const ChainName = ({ title, logo }) => (
  <div className={`${grid['col-xs-4']} ${styles.chainName}`}>
    <img src={logo} />
    <span>{title}</span>
  </div>
);

const BlockchainApplicationRow = ({
  data,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <div data-testid="applications-row" className={`transaction-row-wrapper ${styles.container}`}>
      <DialogLink
        className={`${grid.row} ${className} blockchain-application-row`}
        component="blockChainApplicationDetails"
        data={{ chainId: data.chainID }}
      >
        <ChainName title={data.name} logo={liskLogo} />
        <ChainId id={data.chainID} />
        <ChainStatus status={data.state} t={t} />
        <DepositAmount amount={data.depositedLsk} />
      </DialogLink>
    </div>
  );
};

export default BlockchainApplicationRow;
