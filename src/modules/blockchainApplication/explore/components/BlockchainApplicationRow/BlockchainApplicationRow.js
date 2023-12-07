import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import TokenAmount from '@token/fungible/components/tokenAmount';
import { usePinBlockchainApplication } from '@blockchainApplication/manage/hooks/usePinBlockchainApplication';
import DialogLink from '@theme/dialog/link';
import FlashMessageHolder from 'src/theme/flashMessage/holder';
import styles from './BlockchainApplicationRow.css';
import WarnMissingAppMetaData from '../BlockchainApplications/WarnMissingAppMetaData';
import { ReactComponent as CautionIcon } from '../../../../../../setup/react/assets/images/icons/caution-icon-filled.svg';

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
    {logo ? (
      <img src={logo} />
    ) : (
      <div className={styles.chainInitials}>
        {title?.[0]?.toUpperCase()}
        <CautionIcon />
      </div>
    )}
    <span>{title}</span>
  </div>
);

const RowWrapper = ({ application, children, className, handleShowFlashMessage }) => {
  if (application.serviceURLs) {
    return (
      <DialogLink
        className={`${grid.row} ${className} ${styles.dialogLink} blockchain-application-row`}
        component="blockChainApplicationDetails"
        data={{ chainId: application.chainID }}
      >
        {children}
      </DialogLink>
    );
  }

  return (
    <div
      className={`${grid.row} ${className} ${styles.dialogLink} blockchain-application-row`}
      onClick={handleShowFlashMessage}
    >
      {children}
    </div>
  );
};

const BlockchainApplicationRow = ({ data, className, t }) => {
  const { checkPinByChainId } = usePinBlockchainApplication();

  const application = {
    ...data,
    isPinned: checkPinByChainId(data.chainID),
  };

  const registerApplication = () => {
    FlashMessageHolder.deleteMessage('WarnMissingAppMetaData');
  };

  const handleShowFlashMessage = () => {
    FlashMessageHolder.addMessage(
      <WarnMissingAppMetaData registerApplication={registerApplication} />,
      'WarnMissingAppMetaData'
    );
  };

  return (
    <div data-testid="applications-row" className={`application-row ${styles.container}`}>
      <RowWrapper
        application={application}
        className={className}
        handleShowFlashMessage={handleShowFlashMessage}
      >
        <>
          <ChainName
            title={application.chainName}
            logo={application.logo?.svg || application.logo?.png}
          />
          <ChainId id={application.chainID} />
          <ChainStatus status={application.status} t={t} />
          <DepositAmount amount={application.escrowedLSK} />
        </>
      </RowWrapper>
    </div>
  );
};

export default BlockchainApplicationRow;
