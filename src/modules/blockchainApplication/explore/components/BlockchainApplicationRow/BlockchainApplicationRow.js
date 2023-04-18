import React, { useCallback } from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import TokenAmount from '@token/fungible/components/tokenAmount';
import { usePinBlockchainApplication } from '@blockchainApplication/manage/hooks/usePinBlockchainApplication';
import DialogLink from '@theme/dialog/link';
import { TertiaryButton } from '@theme/buttons';
import Icon from '@theme/Icon';
import { getLogo } from '@token/fungible/utils/helpers';
import styles from './BlockchainApplicationRow.css';

const DepositAmount = ({ amount }) => (
  <span className={`deposit-amount ${styles.amount} ${grid['col-xs-3']}`}>
    <TokenAmount isLsk val={amount} />
  </span>
);

const ChainId = ({ id }) => (
  <div className={`chain-id ${styles.chainId} ${grid['col-xs-3']}`}>
    <span>{id}</span>
  </div>
);

const ChainStatus = ({ status, t }) => (
  <div className={grid['col-xs-2']}>
    <span className={`chain-status ${styles.statusChip} ${styles[status]}`}>{t(status)}</span>
  </div>
);

const ChainName = ({ title, logo }) => (
  <div className={`chain-name ${grid['col-xs-4']} ${styles.chainName}`}>
    <img src={logo} />
    <span>{title}</span>
  </div>
);

const Pin = ({ isPinned, onTogglePin }) => (
  <div className={`${styles.pinWrapper} ${isPinned ? styles.show : ''}`}>
    <TertiaryButton onClick={onTogglePin} className="blockchain-application-pin-button">
      <Icon data-testid="pin-button" name={isPinned ? 'pinnedIcon' : 'unpinnedIcon'} />
    </TertiaryButton>
  </div>
);

const BlockchainApplicationRow = ({ data, className, t }) => {
  const { checkPinByChainId, togglePin } = usePinBlockchainApplication();

  const handleTogglePin = useCallback(
    (event) => {
      event.stopPropagation();
      togglePin(data.chainID);
    },
    [togglePin]
  );

  const application = {
    ...data,
    isPinned: checkPinByChainId(data.chainID),
  };

  return (
    <div data-testid="applications-row" className={`application-row ${styles.container}`}>
      <DialogLink
        className={`${grid.row} ${className} ${styles.dialogLink} blockchain-application-row`}
        component="blockChainApplicationDetails"
        data={{ chainId: application.chainID }}
      >
        <Pin isPinned={application.isPinned} onTogglePin={handleTogglePin} />
        <ChainName title={application.chainName} logo={getLogo(application)} />
        <ChainId id={application.chainID} />
        <ChainStatus status={application.status} t={t} />
        <DepositAmount amount={application.depositedLsk} />
      </DialogLink>
    </div>
  );
};

export default BlockchainApplicationRow;
