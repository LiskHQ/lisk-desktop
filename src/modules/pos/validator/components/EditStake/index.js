/* eslint-disable max-lines */
/* eslint-disable complexity */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { selectSearchParamValue, removeThenAppendSearchParamsToUrl } from 'src/utils/searchParams';
import { useCurrentAccount } from '@account/hooks';
import { convertFromBaseDenom, convertToBaseDenom } from '@token/fungible/utils/helpers';
import { useCommandSchema } from '@network/hooks';
import Dialog from 'src/theme/dialog/dialog';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import BoxFooter from 'src/theme/box/footer';
import BoxHeader from 'src/theme/box/header';
import BoxInfoText from 'src/theme/box/infoText';
import AmountField from 'src/modules/common/components/amountField';
import { useSchemas } from '@transaction/hooks/queries/useSchemas';
import WalletVisual from '@wallet/components/walletVisual';
import routes from 'src/routes/routes';
import TokenAmount from '@token/fungible/components/tokenAmount';
import WarnPunishedValidator from '@pos/validator/components/WarnPunishedValidator';
import { usePosExpectedSharedRewards } from '@pos/reward/hooks/queries/useStakingRewards';
import { useLatestBlock } from '@block/hooks/queries/useLatestBlock';
import { useAuth } from '@auth/hooks/queries';
import { PrimaryButton, SecondaryButton, WarningButton } from 'src/theme/buttons';
import CategorySwitch from '@wallet/components/RegisterMultisigForm/CategorySwitch';
import { useDebounce } from '@search/hooks/useDebounce';
import Spinner from 'src/theme/Spinner/Spinner';
import Tooltip from 'src/theme/Tooltip/tooltip';
import useStakeAmountField from '../../hooks/useStakeAmountField';
import getMaxAmount from '../../utils/getMaxAmount';
import styles from './editStake.css';
import { useValidators, useSentStakes } from '../../hooks/queries';
import { NUMBER_OF_BLOCKS_PER_DAY } from '../../consts';
import { getRewardsSharedInPercentage, convertCommissionToPercentage } from '../../utils';
import { useStakesRetrieved } from '../../store/actions/staking';
import usePosToken from '../../hooks/usePosToken';

const getTitles = (t) => ({
  edit: {
    title: t('Edit stake'),
    description: t('Edit your stake by modifying stake amount or removing existing stake.'),
  },
  add: {
    title: t('Add to staking queue'),
    description: t(
      'Input your Stake amount. This value shows how much trust you have in this validator.'
    ),
  },
});

const REWARD_DURATIONS = {
  monthly: 'MONTHLY',
  yearly: 'YEARLY',
};

// eslint-disable-next-line max-statements
const EditStake = ({ history, stakeEdited, network, staking }) => {
  const { t } = useTranslation();
  useSchemas();

  const { moduleCommandSchemas } = useCommandSchema();
  const [
    {
      metadata: { address: currentAddress },
    },
  ] = useCurrentAccount();
  const { data: sentStakes } = useSentStakes({
    config: { params: { address: currentAddress } },
  });
  useStakesRetrieved(currentAddress);

  const [maxAmount, setMaxAmount] = useState(0);
  const [isForm, setIsForm] = useState(true);
  const [selectedDuration, setSelectedDuration] = useState(REWARD_DURATIONS.monthly);

  const address =
    selectSearchParamValue(history.location.search, 'validatorAddress') || currentAddress;

  const { data: validators, isLoading: isLoadingValidators } = useValidators({
    config: { params: { address } },
  });

  const validator = useMemo(() => validators?.data?.[0] || {}, [isLoadingValidators]);
  const validatorPomHeight = useMemo(() => validator.punishmentPeriods?.[0] || {}, [validator]);
  const {
    data: { height: currentHeight },
  } = useLatestBlock();

  const { token } = usePosToken();

  const { data: authData } = useAuth({ config: { params: { address } } });
  const auth = useMemo(() => ({ ...authData?.data, ...authData?.meta }), [authData]);
  const { nonce, publicKey, numberOfSignatures, optionalKeys = [], mandatoryKeys = [] } = auth;

  const [start = validatorPomHeight.start, end = validatorPomHeight.end] = selectSearchParamValue(
    history.location.search,
    ['start', 'end']
  );

  const validatorStake = useMemo(() => {
    const stakes = sentStakes?.data?.stakes;
    if (!stakes) return false;

    return stakes.find(({ address: stakerAddress }) => stakerAddress === address);
  }, [sentStakes, address, staking]);

  // Find cumulative sum of the difference between unconfirmed and confirmed votes
  // and subtract from available balance
  const getPendingStakeAmount = useCallback(() => {
    const pendingStakeAmounts = Object.keys(staking).reduce(
      (amount, accountAddress) =>
        amount + (staking[accountAddress].unconfirmed - staking[accountAddress].confirmed),
      0
    );
    return pendingStakeAmounts;
  }, [staking]);
  const pendingStakeBalance = getPendingStakeAmount();

  const [stakeAmount, setStakeAmount, isGettingPosToken] = useStakeAmountField(
    convertFromBaseDenom(staking[address]?.unconfirmed || validatorStake?.amount || 0, token),
    pendingStakeBalance
  );
  const mode = validatorStake || staking[address] ? 'edit' : 'add';
  const titles = getTitles(t)[mode];

  const isMonthly = selectedDuration === REWARD_DURATIONS.monthly;
  const queryConfig = {
    options: {
      enabled: !!validator.address && !stakeAmount.error && Number(stakeAmount.value) > 0,
    },
    config: {
      params: {
        validatorAddress: validator.address,
        stake: convertToBaseDenom(stakeAmount.value, token),
        validatorReward: '0',
      },
    },
  };

  const debouncedQueryConfig = useDebounce(queryConfig, 500);
  const { data: expectedReward, isFetching: isFetchingRewards } = usePosExpectedSharedRewards(
    debouncedQueryConfig,
    isMonthly
  );

  useEffect(() => {
    getMaxAmount({
      balance: token.availableBalance,
      nonce,
      publicKey,
      staking,
      address,
      network,
      numberOfSignatures,
      mandatoryKeys,
      optionalKeys,
      moduleCommandSchemas,
      token,
    }).then(setMaxAmount);
  }, [token, auth, network, staking]);

  const handleConfirm = () => {
    if (!isForm) {
      removeThenAppendSearchParamsToUrl(history, { modal: 'stakingQueue' }, ['modal']);
      return;
    }
    stakeEdited([
      {
        validator,
        amount: convertToBaseDenom(stakeAmount.value, token),
      },
    ]);

    setIsForm(false);
  };

  const handleContinueStaking = () => history.push(routes.validators.path);

  const removeStake = () => {
    stakeEdited([
      {
        validator,
        amount: convertToBaseDenom(0),
      },
    ]);
    setIsForm(false);
  };

  const daysLeft = Math.ceil((parseInt(end, 10) - currentHeight) / NUMBER_OF_BLOCKS_PER_DAY);
  const subTitles = {
    edit: t('Edit your stake by modifying stake amount or removing existing stake.'),
    add: titles.description,
  };
  const headerTitles = {
    edit: t('Edit Stake'),
    add: titles.title,
  };

  const handleSelectDuration = ({ target: { value } }) => {
    setSelectedDuration(value);
  };

  return (
    <Dialog
      hasClose
      className={`${styles.wrapper} ${!isForm || mode === 'edit' ? styles.confirmWrapper : ''}`}
    >
      <Box>
        <BoxHeader>
          <h1>{!isForm ? t('Stake added') : headerTitles[mode]}</h1>
        </BoxHeader>
        <BoxContent className={styles.noPadding}>
          <BoxInfoText>
            <span className={styles.subtitle}>
              {!isForm ? t('Stake has been added to your staking queue') : subTitles[mode]}
            </span>
          </BoxInfoText>
          {isForm && (
            <>
              <BoxInfoText className={styles.accountInfo}>
                <WalletVisual size={40} address={address} />
                <p>{validator.name}</p>
                <p>{validator.address}</p>
                <p>
                  {t('Commission :')}{' '}
                  <span>{convertCommissionToPercentage(validator.commission)}%</span>
                </p>
              </BoxInfoText>
              <label className={styles.fieldGroup}>
                <p className={styles.availableBalance}>
                  <span>{t('Usable balance: ')}</span>
                  <span>
                    <TokenAmount
                      isStake
                      token={token}
                      val={token.availableBalance - pendingStakeBalance}
                    />
                  </span>
                </p>
                <AmountField
                  token={token}
                  amount={stakeAmount}
                  onChange={setStakeAmount}
                  maxAmount={{ value: maxAmount }}
                  displayConverter
                  label={t(`Stake amount (${token.symbol})`)}
                  labelClassname={`${styles.fieldLabel}`}
                  placeholder={t('Enter stake amount')}
                  name="stake"
                />
              </label>
              {daysLeft >= 1 && start !== undefined && (
                <>
                  <WarnPunishedValidator pomHeight={{ start, end }} stake />
                  <span className={styles.space} />
                </>
              )}
              <div className={styles.durationSelect}>
                <div>
                  <span>{t('Estimated reward')}</span>
                  <CategorySwitch
                    value={selectedDuration}
                    onChangeCategory={handleSelectDuration}
                    categories={[
                      { value: REWARD_DURATIONS.monthly, label: t('Monthly') },
                      { value: REWARD_DURATIONS.yearly, label: t('Yearly') },
                    ]}
                  />
                  <span>:</span>
                </div>
                {!isFetchingRewards ? (
                  <TokenAmount val={expectedReward?.data.reward || 0} token={token} />
                ) : (
                  <Spinner />
                )}
              </div>
              <div className={styles.durationSelect}>
                <span>
                  {t('Shared rewards')}
                  <Tooltip size="s" position="right">
                    <p>{t('Total rewards shared by the \nvalidator for the amount staked.')}</p>
                  </Tooltip>{' '}
                  :
                </span>
                <span>{getRewardsSharedInPercentage(validator.commission)}%</span>
              </div>
            </>
          )}
        </BoxContent>
        <BoxFooter direction={mode === 'edit' && isForm ? 'horizontal' : 'vertical'}>
          {mode === 'edit' && isForm && (
            <WarningButton
              className={`${styles.removeStakeButton} remove-stake`}
              onClick={removeStake}
            >
              {t('Remove stake')}
            </WarningButton>
          )}
          {!isForm && (
            <SecondaryButton
              className={`${styles.confirmButton}`}
              onClick={handleContinueStaking}
              disabled={stakeAmount.error}
            >
              {t('Continue staking')}
            </SecondaryButton>
          )}
          <PrimaryButton
            className={`${styles.confirmButton} confirm`}
            onClick={handleConfirm}
            disabled={
              stakeAmount.error ||
              isGettingPosToken ||
              (isForm &&
                stakeAmount.value === convertFromBaseDenom(staking[address]?.confirmed, token))
            }
          >
            {t(isForm ? 'Confirm' : 'Go to the staking queue')}
          </PrimaryButton>
        </BoxFooter>
      </Box>
    </Dialog>
  );
};

export default EditStake;
