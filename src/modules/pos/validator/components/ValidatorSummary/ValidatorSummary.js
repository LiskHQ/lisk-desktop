import React from 'react';
import { useTranslation } from 'react-i18next';
import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import Icon from 'src/theme/Icon';
import { truncateAddress } from 'src/modules/wallet/utils/account';
import DateTimeFromTimestamp from 'src/modules/common/components/timestamp';
import WalletVisual from 'src/modules/wallet/components/walletVisual';
import { PrimaryButton } from 'src/theme/buttons';
import DialogLink from 'src/theme/dialog/link';
import styles from './ValidatorSummary.css';
import { convertCommissionToPercentage } from '../../utils';

const ValidatorSummary = ({ validator, status, weight }) => {
  const { address, name, rank, commission, nextGeneratingTime } = validator;
  const { t } = useTranslation();

  return (
    <Box className={styles.wrapper}>
      <BoxHeader>
        <div className={`${styles.validatorDetails}`}>
          <WalletVisual address={address} size={44} />
          <div>
            <p className={styles.validatorName}>
              <span>{name}</span>
              <span className={status.className}>{status.value}</span>
            </p>
            <p className={styles.validatorAddress}>{truncateAddress(address)}</p>
          </div>
          <div>
            <DialogLink component="editStake">
              <PrimaryButton disabled={status.className === 'banned'}>{t('Stake')}</PrimaryButton>
            </DialogLink>
          </div>
        </div>
      </BoxHeader>
      <BoxContent>
        {/* @Todo: the value of roundLength should be dynamically integrated from the usePosConstants query hook which would be addressed in issue #4502 */}
        <p>{t('This validator is among the first 101 validators in validator weight ranking.')}</p>
        <div className={styles.summaryDetails}>
          <div>
            <span>
              <Icon name="starDark" />
            </span>
            <span>{rank}</span>
          </div>
          <div>
            <span>
              <Icon name="weightDark" />
            </span>
            <span>{weight}</span>
          </div>
          <div>
            <span>{t('Commission :')}</span>
            <span data-testid="commission">{convertCommissionToPercentage(commission)}%</span>
          </div>
          <div>
            <span>{t('Last generated :')}</span>
            <span>
              <DateTimeFromTimestamp time={nextGeneratingTime} />
            </span>
          </div>
        </div>
      </BoxContent>
    </Box>
  );
};

export default ValidatorSummary;
