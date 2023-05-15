import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import Box from '@theme/box';
import TokenAmount from '@token/fungible/components/tokenAmount';
import ValueAndLabel from '@transaction/components/TransactionDetails/valueAndLabel';
import CopyToClipboard from '@common/components/copyToClipboard';
import { TertiaryButton, PrimaryButton, OutlineButton } from '@theme/buttons';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Dialog from '@theme/dialog/dialog';
import Icon from '@theme/Icon';
import Tooltip from '@theme/Tooltip';
import { parseSearchParams } from 'src/utils/searchParams';
import { getLogo } from '@token/fungible/utils/helpers';
import Skeleton from '@common/components/skeleton/Skeleton';
import Illustration from 'src/modules/common/components/illustration';
import { useBlockchainApplicationExplore } from '../../../explore/hooks/queries/useBlockchainApplicationExplore';
import { useBlockchainApplicationMeta } from '../../hooks/queries/useBlockchainApplicationMeta';
import { useApplicationManagement } from '../../hooks/useApplicationManagement';
import styles from './RemoveApplicationDetails.css';

// eslint-disable-next-line max-statements, complexity
const RemoveApplicationDetails = ({ location, onCancel, nextStep }) => {
  const { t } = useTranslation();
  const chainId = parseSearchParams(location.search)?.chainId;
  const {
    data: onChainData,
    refetch: refetchOnChainData,
    isLoading: onChainLoading,
    isError: isOnChainDataError,
  } = useBlockchainApplicationExplore({
    config: { params: { chainID: chainId } },
    options: { enabled: !!chainId },
  });
  const {
    data: offChainData,
    refetch: refetchOffChainData,
    isLoading: offChainLoading,
    isError: isOffChainDataError,
  } = useBlockchainApplicationMeta({
    config: { params: { chainID: chainId } },
    options: { enabled: !!chainId },
  });
  const application = { ...onChainData?.data[0], ...offChainData?.data[0] };

  const { deleteApplicationByChainId } = useApplicationManagement();
  const {
    chainName,
    status,
    address,
    lastCertificateHeight,
    lastUpdated,
    projectPage,
    depositedLsk = 0,
  } = application;

  const reloadAppDetails = () => {
    refetchOnChainData();
    refetchOffChainData();
  };

  const footerDetails = [
    {
      header: {
        text: t('Chain ID'),
        toolTipText: t('The chain ID uniquely identifies a chain in the Lisk ecosystem'),
      },
      className: `${styles.detailContentText} ${styles.chainId} chain-id`,
      content: chainId,
    },
    {
      header: t('Status'),
      className: `${styles.detailContentText} ${styles.statusChip} ${styles[status]} chain-status`,
      content: t(status),
    },
    {
      header: t('Last Update'),
      className: `${styles.detailContentText} last-update`,
      content: moment(lastUpdated * 1000).format('DD MMM YYYY'),
    },
    {
      header: t('Last Certificate Height'),
      className: `${styles.detailContentText} last-certificate-height`,
      content: lastCertificateHeight,
    },
  ];

  const handleRemoveApplication = () => {
    deleteApplicationByChainId(chainId);
    nextStep({ application });
  };

  if (isOnChainDataError || isOffChainDataError)
    return (
      <Dialog hasClose className={`${grid.row} ${grid['center-xs']}`}>
        <div className={`${styles.wrapper} ${styles.errorWrapper}`}>
          <Illustration name="applicationDetailsError" />
          <div className={styles.errorText}>{t('Error loading application data')}</div>
          <div className={styles.retryBtn}>
            <TertiaryButton onClick={reloadAppDetails}>Try again</TertiaryButton>
          </div>
        </div>
      </Dialog>
    );

  return (
    <Dialog className={`${styles.dialogWrapper} ${grid.row} ${grid['center-xs']}`}>
      <div className={styles.wrapper}>
        {onChainLoading || offChainLoading ? (
          <Box className={`${styles.headerContainer} ${styles.skeletonRowWrapper}`}>
            <Skeleton className={styles.skeleton} width="25%" />
          </Box>
        ) : (
          <Box className={styles.headerContainer}>
            <p>{t('Remove application')}</p>
            <div>
              <img src={getLogo(application)} />
            </div>
          </Box>
        )}
        <Box className={styles.detailsWrapper}>
          {onChainLoading || offChainLoading ? (
            <div className={styles.chainNameWrapper}>
              <Skeleton className={styles.skeleton} width="25%" />
            </div>
          ) : (
            <div className={styles.chainNameWrapper}>
              <span className="chain-name-text">{chainName}</span>
            </div>
          )}
          {onChainLoading || offChainLoading ? (
            <Box className={styles.addressRow}>
              <Skeleton className={styles.skeleton} width="25%" />
            </Box>
          ) : (
            address && (
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
            )
          )}
          {onChainLoading || offChainLoading ? (
            <div className={`${styles.addressRow} ${styles.skeletonRowWrapper}`}>
              <Skeleton className={styles.skeleton} width="200px" />
            </div>
          ) : (
            <div className={styles.addressRow}>
              <a className={`${styles.appLink}`} target="_blank" href={projectPage}>
                <Icon name="chainLinkIcon" className={styles.hwWalletIcon} />
                {t(projectPage)}
              </a>
            </div>
          )}
          {onChainLoading || offChainLoading ? (
            <div className={`${styles.balanceRow} ${styles.skeletonRowWrapper}`}>
              <Skeleton className={styles.skeleton} width="200px" />
            </div>
          ) : (
            <div className={styles.balanceRow}>
              <span>{t('Deposited:')}</span>
              <span>
                <TokenAmount isLsk val={depositedLsk} />
              </span>
            </div>
          )}
          {onChainLoading || offChainLoading ? (
            <Box className={styles.footerDetailsRow}>
              {footerDetails.map((_, idx) => (
                <Fragment key={idx}>
                  <Skeleton
                    className={`${styles.skeleton} ${styles.skeletonRowWrapper}`}
                    width="25%"
                  />
                </Fragment>
              ))}
            </Box>
          ) : (
            <Box className={styles.footerDetailsRow}>
              {footerDetails.map(({ header, content, className }, index) => (
                <ValueAndLabel
                  key={index}
                  className={styles.detail}
                  label={
                    <span className={styles.headerText}>
                      <>
                        {header.text || header}
                        {header.toolTipText && (
                          <Tooltip position="right">
                            <p>{header.toolTipText}</p>
                          </Tooltip>
                        )}
                      </>
                    </span>
                  }
                >
                  <span className={className}>{content}</span>
                </ValueAndLabel>
              ))}
            </Box>
          )}
          <Box className={styles.actionsRow}>
            <OutlineButton
              className={`${styles.button} ${styles.cancelButton} cancel-remove-blockchain`}
              onClick={onCancel}
            >
              {t('Cancel')}
            </OutlineButton>
            <PrimaryButton
              className={`${styles.button} remove-blockchain`}
              onClick={handleRemoveApplication}
            >
              {t('Remove application now')}
            </PrimaryButton>
          </Box>
        </Box>
      </div>
    </Dialog>
  );
};

export default RemoveApplicationDetails;
