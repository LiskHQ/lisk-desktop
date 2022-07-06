import React from 'react';
import { useTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import DialogLink from 'src/theme/dialog/link';
import { TertiaryButton } from 'src/theme/buttons';
import Icon from 'src/theme/Icon';
import { usePinBlockchainApplication } from '@blockchainApplication/manage/hooks/usePinBlockchainApplication';
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

const Pin = ({ isPinned, onTogglePin }) => (
  <div className={`${styles.pinWrapper} ${isPinned ? styles.show : ''}`}>
    <TertiaryButton onClick={onTogglePin}>
      <Icon data-testid="pin-button" name={isPinned ? 'pinnedIcon' : 'unpinnedIcon'} />
    </TertiaryButton>
  </div>
);

const SkeletonLoaderRow = () => (
  <div className={`${styles.skeletonLoader} ${grid.row}`}>
    <div className={grid['col-xs-4']}>
      <div />
      <div />
    </div>
    <div className={grid['col-xs-3']}>
      <div />
    </div>
    <div className={grid['col-xs-2']}>
      <div />
    </div>
    <div className={grid['col-xs-3']}>
      <div />
    </div>
  </div>
);

const BlockchainApplicationRow = ({
  data,
  className,
  isLoading,
}) => {
  const { t } = useTranslation();
  const { togglePin } = usePinBlockchainApplication();
  const handleTogglePin = (event) => {
    event.stopPropagation();
    togglePin(data.chainID);
  };

  return (
    !isLoading ? (
      <div data-testid="applications-row" className={`transaction-row-wrapper ${styles.container}`}>
        <DialogLink
          className={`${grid.row} ${className} blockchain-application-row`}
          component="blockChainApplicationDetails"
          data={{ chainId: data.chainID }}
        >
          <Pin isPinned={data.isPinned} onTogglePin={handleTogglePin} />
          <ChainName title={data.name} logo={liskLogo} />
          <ChainId id={data.chainID} />
          <ChainStatus status={data.state} t={t} />
          <DepositAmount amount={data.depositedLsk} />
        </DialogLink>
      </div>
    ) : <SkeletonLoaderRow />
  );
};

export default BlockchainApplicationRow;
