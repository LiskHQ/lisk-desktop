/* eslint-disable complexity */
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  selectSearchParamValue,
  removeSearchParamsFromUrl,
  removeThenAppendSearchParamsToUrl,
} from 'src/utils/searchParams';
import { useCurrentAccount } from '@account/hooks';
import { fromRawLsk, toRawLsk } from '@token/fungible/utils/lsk';
import { useTokensBalance } from '@token/fungible/hooks/queries';
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
import useVoteAmountField from '../../hooks/useVoteAmountField';
import getMaxAmount from '../../utils/getMaxAmount';
import styles from './editStake.css';
import { useValidators, usePosConstants, useSentStakes } from '../../hooks/queries';
import { NUMBER_OF_BLOCKS_PER_DAY } from '../../consts';
import { extractValidatorCommission } from '../../utils';

const getTitles = (t) => ({
  edit: {
    title: t('Edit stake'),
    description: t(
      'Increase or decrease your stake amount, or remove your stake from this validator. Your updated stake will be added to the staking queue.'
    ),
  },
  add: {
    title: t('Add to staking queue'),
    description: t(
      'Insert an amount you wish to stake for this validator. Your new stake will then be added to the staking queue.'
    ),
  },
});

// eslint-disable-next-line max-statements
const EditStake = ({ history, stakeEdited, network, voting, stakesRetrieved }) => {
  const { t } = useTranslation();
  useSchemas();
  const { moduleCommandSchemas } = useCommandSchema();
  const [
    {
      metadata: { address: currentAddress },
    },
  ] = useCurrentAccount();
  const [maxAmount, setMaxAmount] = useState(0);
  const [isForm, setIsForm] = useState(true);

  const [address] = selectSearchParamValue(history.location.search, ['address']);
  const validatorAddress = address || currentAddress; // this holds the address of either other validators or the user's address

  const { data: validators, isLoading: isLoadingValidators } = useValidators({
    config: { params: { address: validatorAddress } },
  });

  const validator = useMemo(() => validators?.data?.[0] || {}, [isLoadingValidators]);
  const validatorPomHeight = useMemo(() => validator.punishmentPeriods?.[0] || {}, [validator]);
  const {
    data: { height: currentHeight },
  } = useLatestBlock();

  const { data: sentVotes } = useSentStakes({
    config: { params: { address: currentAddress } },
  });

  // @TODO: we need to change the caching time from 5mins to something larger since this is a constant that doesn't frequently change
  const { data: posConstants, isLoading: isGettingPosConstants } = usePosConstants();

  const { data: tokens } = useTokensBalance({
    config: { params: { tokenID: posConstants?.posTokenID } },
    options: { enabled: !isGettingPosConstants },
  });
  const token = useMemo(() => tokens?.data?.[0] || {}, [tokens]);

  const { data: authData } = useAuth({ config: { params: { address: validatorAddress } } });
  const auth = useMemo(() => ({ ...authData?.data, ...authData?.meta }), [authData]);
  const { nonce, publicKey, numberOfSignatures, optionalKeys = [], mandatoryKeys = [] } = auth;

  const [start = validatorPomHeight.start, end = validatorPomHeight.end] = selectSearchParamValue(
    history.location.search,
    ['start', 'end']
  );

  const voteSentVoteToDelegate = useMemo(() => {
    const votes = sentVotes?.data?.votes;
    if (!votes) return false;

    return votes.find(({ validatorAddress: dAddress }) => dAddress === validatorAddress);
  }, [sentVotes, validatorAddress, voting]);

  const [voteAmount, setVoteAmount, isGettingDposToken] = useVoteAmountField(
    fromRawLsk(voting[validatorAddress]?.unconfirmed || voteSentVoteToDelegate?.amount || 0)
  );
  const mode = voteSentVoteToDelegate || voting[validatorAddress] ? 'edit' : 'add';
  const titles = getTitles(t)[mode];

  useEffect(() => {
    getMaxAmount({
      balance: token.availableBalance,
      nonce,
      publicKey,
      voting,
      address,
      network,
      numberOfSignatures,
      mandatoryKeys,
      optionalKeys,
      moduleCommandSchemas,
    }).then(setMaxAmount);
  }, [token, auth, network, voting]);

  useEffect(() => {
    stakesRetrieved();
  }, []);

  const handleConfirm = () => {
    if (!isForm) {
      removeThenAppendSearchParamsToUrl(history, { modal: 'stakingQueue' }, ['modal']);
      return;
    }
    stakeEdited([
      {
        validator,
        address: validatorAddress,
        amount: toRawLsk(voteAmount.value),
        name: validator.name,
      },
    ]);

    setIsForm(false);
  };

  const handleContinueVoting = () => history.push(routes.validators.path);

  const removeVote = () => {
    stakeEdited([
      {
        validator,
        name: validator.name,
        address: validatorAddress,
        amount: 0,
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
                <WalletVisual size={40} address={validatorAddress} />
                <p>{validator.name}</p>
                <p>{validatorAddress}</p>
                <p>
                  Commission: <span>{extractValidatorCommission(validator.commission)}%</span>
                </p>
              </BoxInfoText>
              <label className={styles.fieldGroup}>
                <p className={styles.availableBalance}>
                  <span>{t('Available balance: ')}</span>
                  <span>
                    <TokenAmount token={token.symbol} val={token.availableBalance} />
                  </span>
                </p>

                <AmountField
                  amount={voteAmount}
                  onChange={setVoteAmount}
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
                  <WarnPunishedValidator pomHeight={{ start, end }} vote />
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
              onClick={removeVote}
            >
              {t('Remove stake')}
            </WarningButton>
          )}
          {!isForm && (
            <SecondaryButton
              className={`${styles.confirmButton}`}
              onClick={handleContinueVoting}
              disabled={voteAmount.error}
            >
              {t('Continue staking')}
            </SecondaryButton>
          )}
          <PrimaryButton
            className={`${styles.confirmButton} confirm`}
            onClick={handleConfirm}
            disabled={voteAmount.error || isGettingDposToken}
          >
            {t(isForm ? 'Confirm' : 'Go to the staking queue')}
          </PrimaryButton>
        </BoxFooter>
      </Box>
    </Dialog>
  );
};

export default EditStake;
