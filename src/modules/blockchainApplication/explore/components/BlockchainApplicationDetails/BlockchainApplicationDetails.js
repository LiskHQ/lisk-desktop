import React from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import Box from 'src/theme/box';
import TokenAmount from '@token/fungible/components/tokenAmount';
import ValueAndLabel from 'src/modules/transaction/components/TransactionDetails/valueAndLabel';
import CopyToClipboard from 'src/modules/common/components/copyToClipboard';
import { PrimaryButton, TertiaryButton } from 'src/theme/buttons';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Dialog from '@theme/dialog/dialog';
import Icon from 'src/theme/Icon';
import Tooltip from 'src/theme/Tooltip';
import { parseSearchParams, removeThenAppendSearchParamsToUrl } from 'src/utils/searchParams';
import useApplicationManagement from 'src/modules/blockchainApplication/manage/hooks/useApplicationManagement';
import { usePinBlockchainApplication } from '@blockchainApplication/manage/hooks/usePinBlockchainApplication';
import defaultBackgroundImage from '../../../../../../setup/react/assets/images/default-chain-background.png';
import liskLogo from '../../../../../../setup/react/assets/images/LISK.png';
import styles from './BlockchainApplicationDetails.css';

const deposit = 5e10;
const serviceUrl = 'https://lisk.com/';
const backgroundImage = null;
const chainLogo = null;

// eslint-disable-next-line max-statements
const BlockchainApplicationDetails = ({ history, location, application }) => {
  const { t } = useTranslation();
  const chainId = parseSearchParams(location.search).chainId;
  const mode = parseSearchParams(location.search).mode;
  const { checkPinByChainId, togglePin } = usePinBlockchainApplication();
  const {
    name, state, address, lastCertificateHeight, lastUpdated,
  } = application.data;
  const { setApplication } = useApplicationManagement();

  const isPinned = checkPinByChainId(chainId);
  const toggleApplicationPin = () => {
    togglePin(chainId);
  };
  const addNewApplication = () => {
    setApplication(application.data);
    removeThenAppendSearchParamsToUrl(history, { modal: 'blockChainApplicationAddSuccess', chainId: application.data.chainID }, ['modal', 'chainId', 'mode']);
  };

  const footerDetails = [
    {
      header: {
        text: t('Chain ID'),
        toolTipText: t('The chain ID uniquely identifies a chain in the Lisk ecosystem'),
      },
      className: `${styles.detailContentText} chain-id`,
      content: chainId,
    },
    {
      header: t('Status'),
      className: `${styles.detailContentText} ${styles.statusChip} ${styles[state]} chain-status`,
      content: t(state),
    },
    {
      header: t('Last Update'),
      className: `${styles.detailContentText} last-update`,
      content: moment(lastUpdated).format('DD MMM YYYY'),
    },
    {
      header: t('Last Certificate Height'),
      className: `${styles.detailContentText} last-certificate-height`,
      content: lastCertificateHeight,
    },
  ];

  return (
    <Dialog hasClose className={`${styles.dialogWrapper} ${grid.row} ${grid['center-xs']}`}>
      <div className={styles.wrapper}>
        <div className={styles.avatarContainer}>
          <img src={chainLogo || liskLogo} />
          <img src={backgroundImage || defaultBackgroundImage} />
        </div>
        <Box className={styles.detailsWrapper}>
          <div className={styles.chainNameWrapper}>
            <span className="chain-name-text">{name}</span>
            <TertiaryButton className="chain-details-pin-button" onClick={toggleApplicationPin}>
              <Icon data-testid="pin-button" name={isPinned ? 'pinnedIcon' : 'unpinnedIcon'} />
            </TertiaryButton>
          </div>
          <Box className={styles.addressRow}>
            <ValueAndLabel className={styles.transactionId}>
              <span className="copy-address-wrapper">
                <CopyToClipboard
                  text={address}
                  value={address}
                  className="tx-id"
                  containerProps={{
                    size: 'xs',
                    className: 'copy-address',
                  }}
                />
              </span>
            </ValueAndLabel>
          </Box>
          <div className={styles.addressRow}>
            <a
              className={`${styles.appLink}`}
              target="_blank"
                // eslint-disable-next-line
                // TODO: this is just a placeholder link pending when its part of the response payload from service
              href={serviceUrl}
            >
              <Icon name="chainLinkIcon" className={styles.hwWalletIcon} />
              {t(serviceUrl)}
            </a>
          </div>
          <div className={styles.balanceRow}>
            <span>{t('Deposited:')}</span>
            {/* TODO: this is a placeholder value pending when its part of service response */}
            <span>
              <TokenAmount val={deposit} />
              {' '}
              LSK
            </span>
          </div>
          <Box className={styles.footerDetailsRow}>
            {footerDetails.map(({ header, content, className }, index) => (
              <ValueAndLabel
                key={index}
                className={styles.detail}
                label={(
                  <span className={styles.headerText}>
                    <>
                      {header.text || header}
                      {header.toolTipText && (
                      <Tooltip position="right">
                        <p>
                          {header.toolTipText}
                        </p>
                      </Tooltip>
                      )}
                    </>
                  </span>
                  )}
              >
                <span className={className}>
                  {content}
                </span>
              </ValueAndLabel>
            ))}
          </Box>
          {mode === 'addApplication' ? (
            <Box className={styles.footerButton}>
              <PrimaryButton
                size="l"
                data-testid="add-application-button"
                onClick={addNewApplication}
              >
                {t('Add application to my list')}
              </PrimaryButton>
            </Box>
          ) : null}
        </Box>
      </div>
    </Dialog>
  );
};

export default BlockchainApplicationDetails;
