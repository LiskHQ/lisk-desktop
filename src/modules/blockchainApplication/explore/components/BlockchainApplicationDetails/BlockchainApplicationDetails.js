import React from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import Dialog from '@theme/dialog/dialog';
import Box from 'src/theme/box';
import { useSelector } from 'react-redux';
import { selectActiveToken } from 'src/redux/selectors';
import TokenAmount from '@token/fungible/components/tokenAmount';
import ValueAndLabel from '@transaction/components/TransactionDetails/valueAndLabel';
import { PrimaryButton, TertiaryButton } from 'src/theme/buttons';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Icon from 'src/theme/Icon';
import Tooltip from 'src/theme/Tooltip';
import { parseSearchParams, removeThenAppendSearchParamsToUrl } from 'src/utils/searchParams';
import { useApplicationManagement } from '@blockchainApplication/manage/hooks';
import { usePinBlockchainApplication } from '@blockchainApplication/manage/hooks/usePinBlockchainApplication';
import { getLogo } from '@token/fungible/utils/helpers';
import Illustration from 'src/modules/common/components/illustration';
import styles from './BlockchainApplicationDetails.css';
import { useBlockchainApplicationExplore } from '../../hooks/queries/useBlockchainApplicationExplore';
import { useBlockchainApplicationMeta } from '../../../manage/hooks/queries/useBlockchainApplicationMeta';
import defaultBackgroundImage from '../../../../../../setup/react/assets/images/default-chain-background.png';
import BlockchainAppDetailsHeader from '../BlockchainAppDetailsHeader';

const deposit = 5e10;

// eslint-disable-next-line max-statements
const BlockchainApplicationDetails = ({ history, location }) => {
  const { t } = useTranslation();
  const active = useSelector(selectActiveToken);
  const chainId = parseSearchParams(location.search).chainId;
  const mode = parseSearchParams(location.search).mode;

  const { data: onChainData } = useBlockchainApplicationExplore({
    config: { params: { chainID: chainId } },
  });
  const { data: offChainData } = useBlockchainApplicationMeta({
    config: { params: { chainID: chainId } },
  });
  const aggregatedApplicationData = { ...onChainData?.data[0], ...offChainData?.data[0] };
  const { checkPinByChainId, togglePin } = usePinBlockchainApplication();
  const { status, lastCertificateHeight, lastUpdated, logo } = aggregatedApplicationData;
  const { setApplication } = useApplicationManagement();

  const isPinned = checkPinByChainId(chainId);
  const toggleApplicationPin = () => {
    togglePin(chainId);
  };
  const addNewApplication = () => {
    setApplication(aggregatedApplicationData);
    removeThenAppendSearchParamsToUrl(
      history,
      { modal: 'addApplicationSuccess', chainId: aggregatedApplicationData.chainID },
      ['modal', 'chainId', 'mode']
    );
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
      className: `${styles.detailContentText} ${styles.statusChip} ${styles[status]} chain-status`,
      content: t(status),
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

  const app = {
    data: {
      ...aggregatedApplicationData,
      icon: getLogo({ logo }),
      bg: defaultBackgroundImage,
    },
  };

  if (!onChainData || !offChainData)
    return (
      <Dialog hasClose className={`${grid.row} ${grid['center-xs']}`}>
        <div className={`${styles.wrapper} ${styles.errorWrapper}`}>
          <Illustration name="applicationDetailsError" />
          <div className={styles.errorText}>{t("Couldn't load application data")}</div>
          <div className={styles.retryBtn}>
            <TertiaryButton>Try again</TertiaryButton>
          </div>
        </div>
      </Dialog>
    );

  return (
    <Dialog hasClose hasBack className={`${styles.dialogWrapper} ${grid.row} ${grid['center-xs']}`}>
      <div className={styles.wrapper}>
        <BlockchainAppDetailsHeader
          application={app}
          chainAction={
            <TertiaryButton className="chain-details-pin-button" onClick={toggleApplicationPin}>
              <Icon data-testid="pin-button" name={isPinned ? 'pinnedIcon' : 'unpinnedIcon'} />
            </TertiaryButton>
          }
        />
        <div className={styles.balanceRow}>
          <ValueAndLabel label={t('Deposited:')} direction="horizontal">
            <span className={styles.value}>
              <TokenAmount val={deposit} token={active} />
            </span>
          </ValueAndLabel>
        </div>
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
        {mode === 'addApplication' ? (
          <Box className={styles.footerButton}>
            <PrimaryButton
              size="l"
              className={`${styles.addButton} add-application-button`}
              data-testid="add-application-button"
              onClick={addNewApplication}
            >
              {t('Add application to my list')}
            </PrimaryButton>
          </Box>
        ) : null}
      </div>
    </Dialog>
  );
};

export default BlockchainApplicationDetails;
