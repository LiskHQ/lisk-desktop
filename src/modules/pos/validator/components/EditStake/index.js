/* eslint-disable complexity */
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  selectSearchParamValue,
  removeSearchParamsFromUrl,
  removeThenAppendSearchParamsToUrl,
} from 'src/utils/searchParams';
import { useCurrentAccount } from '@account/hooks';
import { convertFromBaseDenom, convertToBaseDenom } from '@token/fungible/utils/lsk';
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
import { useLatestBlock } from '@block/hooks/queries/useLatestBlock';
import { useAuth } from '@auth/hooks/queries';
import { PrimaryButton, SecondaryButton, WarningButton } from 'src/theme/buttons';
import useStakeAmountField from '../../hooks/useStakeAmountField';
import getMaxAmount from '../../utils/getMaxAmount';
import styles from './editStake.css';
import { useValidators, useSentStakes } from '../../hooks/queries';
import { NUMBER_OF_BLOCKS_PER_DAY } from '../../consts';
import { convertCommissionToPercentage } from '../../utils';
import { useStakesRetrieved } from '../../store/actions/staking';
import usePosToken from '../../hooks/usePosToken';

const getTitles = (t) => ({
  edit: {
    title: t('Edit stake'),
    description: t('After changing your Stake amount, it will be added to the staking queue.'),
  },
  add: {
    title: t('Add to staking queue'),
    description: t(
      'Input your Stake amount. This value shows how much trust you have in this validator.'
    ),
  },
});

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

  const [address] = selectSearchParamValue(history.location.search, ['address']);

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

  const [stakeAmount, setStakeAmount, isGettingPosToken] = useStakeAmountField(
    convertFromBaseDenom(staking[address]?.unconfirmed || validatorStake?.amount || 0, token)
  );
  const mode = validatorStake || staking[address] ? 'edit' : 'add';
  const titles = getTitles(t)[mode];

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
    removeSearchParamsFromUrl(history, ['modal']);
  };

  const daysLeft = Math.ceil((parseInt(end, 10) - currentHeight) / NUMBER_OF_BLOCKS_PER_DAY);
  const subTitles = {
    edit: t('After changing your stake amount, it will be added to the staking queue.'),
    add: titles.description,
  };
  const headerTitles = {
    edit: t('Edit Stake'),
    add: titles.title,
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
            <span>
              {!isForm ? t('Your stake has been added to your staking queue') : subTitles[mode]}
            </span>
          </BoxInfoText>
          {isForm && (
            <>
              <BoxInfoText className={styles.accountInfo}>
                <WalletVisual size={40} address={address} />
                <p>{validator.name}</p>
                <p>{validator.address}</p>
                <p>
                  Commission: <span>{convertCommissionToPercentage(validator.commission)}%</span>
                </p>
              </BoxInfoText>
              <label className={styles.fieldGroup}>
                <p className={styles.availableBalance}>
                  <span>{t('Available balance: ')}</span>
                  <span>
                    <TokenAmount token={token} val={token.availableBalance} />
                  </span>
                </p>

                <AmountField
                  token={token}
                  amount={stakeAmount}
                  onChange={setStakeAmount}
                  maxAmount={{ value: maxAmount }}
                  displayConverter
                  label={t('Stake amount ({{symbol}})', { symbol: token.symbol })}
                  labelClassname={`${styles.fieldLabel}`}
                  placeholder={t('Insert stake amount')}
                  name="stake"
                />
              </label>
              {daysLeft >= 1 && start !== undefined && (
                <>
                  <WarnPunishedValidator pomHeight={{ start, end }} stake />
                  <span className={styles.space} />
                </>
              )}
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
            disabled={stakeAmount.error || isGettingPosToken}
          >
            {t(isForm ? 'Confirm' : 'Go to the staking queue')}
          </PrimaryButton>
        </BoxFooter>
      </Box>
    </Dialog>
  );
};

export default EditStake;
