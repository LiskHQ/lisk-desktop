import React, { useEffect, useMemo } from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { useTranslation } from 'react-i18next';
import { selectSearchParamValue } from 'src/utils/searchParams';
import { useCurrentAccount } from '@account/hooks';
import WalletVisualWithAddress from '@wallet/components/walletVisualWithAddress';
import { useBlocks } from '@block/hooks/queries/useBlocks';
import { useLatestBlock } from '@block/hooks/queries/useLatestBlock';
import Heading from 'src/modules/common/components/Heading';
import { toast } from 'react-toastify';
import FlashMessageHolder from 'src/theme/flashMessage/holder';
import Box from '@theme/box';
import styles from './ValidatorProfile.css';
import DetailsView from './DetailsView';
import PerformanceView from './PerformanceView';
import ValidatorStakesView from './ValidatorStakesView';
import { useValidators } from '../../hooks/queries';
import ValidatorStakeButton from './ValidatorStakeButton';
import WarnPunishedValidator from '../WarnPunishedValidator';

const numOfBlockPerDay = 24 * 60 * 6;
const addWarningMessage = ({ isBanned, pomHeight, readMore }) => {
  FlashMessageHolder.addMessage(
    <WarnPunishedValidator isBanned={isBanned} pomHeight={pomHeight} readMore={readMore} />,
    'WarnPunishedValidator'
  );
};

const removeWarningMessage = () => {
  FlashMessageHolder.deleteMessage('WarnPunishedValidator');
};

// eslint-disable-next-line max-statements
const ValidatorProfile = ({ history }) => {
  const { t } = useTranslation();
  const [{ metadata: { address: currentAddress } = {} }] = useCurrentAccount();
  const address = selectSearchParamValue(history.location.search, 'address') || currentAddress;

  const { data: validators, isLoading: isLoadingValidators } = useValidators({
    config: { params: { address } },
    options: { refetchInterval: 10000 },
  });
  const validator = useMemo(() => validators?.data?.[0] || {}, [validators]);

  const { data: generatedBlocks } = useBlocks({
    config: { params: { generatorAddress: address } },
  });

  const {
    data: { height: currentHeight },
  } = useLatestBlock();
  const isBanned = validator.isBanned;

  useEffect(() => {
    const punishmentPeriods = validator.punishmentPeriods;
    const { end } = punishmentPeriods?.length ? punishmentPeriods[punishmentPeriods.length - 1] : 0;
    const daysLeft = Math.ceil((end - currentHeight) / numOfBlockPerDay);

    if (
      validator.address &&
      address !== currentAddress && // this ensures we are checking against a validator account that is not the current user
      address &&
      (isBanned || punishmentPeriods?.length) &&
      (isBanned || daysLeft >= 1)
    ) {
      addWarningMessage({
        isBanned,
        pomHeight: punishmentPeriods ? punishmentPeriods[punishmentPeriods.length - 1] : 0,
        readMore: () => {
          const url = 'https://lisk.com/blog/development/lisk-staking-process';
          window.open(url, 'rel="noopener noreferrer"');
        },
      });
    } else {
      removeWarningMessage();
    }
  }, [address, validator, currentHeight]);

  const isMyProfile = address === currentAddress;
  if (!validator.address && !isLoadingValidators) {
    toast.info("This user isn't a validator");
    history.goBack();
  }

  return (
    <section className={`${styles.container} container`}>
      <FlashMessageHolder />
      <Heading
        className={styles.header}
        title={
          isMyProfile ? (
            t('My validator profile')
          ) : (
            <WalletVisualWithAddress
              copy
              size={50}
              address={address}
              accountName={validator.name}
              detailsClassName={styles.accountSummary}
              truncate={false}
            />
          )
        }
      >
        <div className={styles.rightHeaderSection}>
          <div className={styles.actionButtons}>
            <ValidatorStakeButton
              currentAddress={currentAddress}
              address={address}
              isBanned={isBanned}
              isDisabled={isLoadingValidators}
            />
          </div>
        </div>
      </Heading>
      <Box
        isLoading={isLoadingValidators}
        className={`${grid.row} ${styles.statsContainer} stats-container`}
      >
        <DetailsView data={validator} isMyProfile={isMyProfile} />
        <PerformanceView data={{ ...validator, producedBlocks: generatedBlocks?.meta?.total }} />
      </Box>
      <ValidatorStakesView address={address} />
    </section>
  );
};

export default ValidatorProfile;
