import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import BoxHeader from '@theme/box/header';
import { useTranslation } from 'react-i18next';
import { MODULE_COMMANDS_NAME_MAP } from '@transaction/configuration/moduleCommand';
import { useAppsMetaTokensConfig, useTokenBalances } from '@token/fungible/hooks/queries';
import TxComposer from '@transaction/components/TxComposer';
import { useCurrentAccount } from '@account/hooks';
import getRewardsClaimableHeader from '@pos/validator/components/ClaimRewardsForm/utils/getRewardsClaimableHeader';
import RewardsClaimableRow from '@pos/validator/components/ClaimRewardsForm/RewardsClaimableRow';
import { splitModuleAndCommand } from '@transaction/utils';
import { useAuth } from '@auth/hooks/queries';
import { useCommandSchema } from '@network/hooks';
import { isEmpty } from 'src/utils/helpers';
import { getRewards } from '@pos/validator/components/StakeForm/StakeForm';
import Table from '@theme/table';
import { addTokensMetaData } from '@token/fungible/utils/addTokensMetaData';
import defaultClient from 'src/utils/api/client';
import { usePosConstants } from '../../hooks/queries';
import styles from './ClaimRewardsForm.css';

// eslint-disable-next-line max-statements
const ClaimRewardsForm = ({ nextStep }) => {
  const { t } = useTranslation();
  const [
    {
      metadata: { pubkey, address },
    },
  ] = useCurrentAccount();
  const createMetaConfig = useAppsMetaTokensConfig();

  const [rewards, setRewards] = useState();
  const transformToken = addTokensMetaData({ createMetaConfig, client: defaultClient });

  const { data: auth } = useAuth({ config: { params: { address } } });
  const authNounce = auth?.data?.nonce;
  const { moduleCommandSchemas } = useCommandSchema();
  const { data: posConstants, isLoading: isGettingPosConstants } = usePosConstants();
  const { data: tokens } = useTokenBalances({
    config: { params: { tokenID: posConstants?.data?.posTokenID, address } },
    options: { enabled: !isGettingPosConstants },
  });
  const token = useMemo(() => tokens?.data?.[0] || {}, [tokens]);
  const onConfirm = (formProps, transactionJSON, selectedPriority, fees) => {
    nextStep({
      formProps,
      transactionJSON,
      selectedPriority,
      fees,
    });
  };

  const unlockBalanceFormProps = {
    moduleCommand: MODULE_COMMANDS_NAME_MAP.claimRewards,
    isFormValid: rewards?.length > 0 && !!Object.keys(token).length,
    enableMinimumBalanceFeedback: true,
    fields: { token },
  };

  const rewardsClaimableHeader = getRewardsClaimableHeader(t);

  useEffect(() => {
    if (isEmpty(moduleCommandSchemas) || !authNounce || !address) {
      return;
    }

    (async () => {
      const [module, command] = splitModuleAndCommand(MODULE_COMMANDS_NAME_MAP.claimRewards);

      const transactionJSON = {
        module,
        command,
        nonce: authNounce,
        fee: 100000000,
        senderPublicKey: pubkey,
        params: {},
        signatures: [],
      };

      const rewardResponse = await getRewards({
        moduleCommandSchemas,
        transactionJSON,
        currentAccountAddress: address,
      });
      const { total, ...validatorHashMap } = rewardResponse?.rewards || {};
      const validators = validatorHashMap && Object.values(validatorHashMap);

      const validatorsWithTokenData = await transformToken(validators);

      setRewards(validatorsWithTokenData);
    })();
  }, [moduleCommandSchemas, authNounce, address]);

  return (
    <section className={classNames(styles.ClaimRewardsForm)}>
      <TxComposer
        onConfirm={onConfirm}
        formProps={unlockBalanceFormProps}
        buttonTitle={t('Claim rewards')}
      >
        <>
          <BoxHeader>
            <h2 className={styles.title}>{t('Claim rewards')}</h2>
          </BoxHeader>
          <p className={styles.description}>
            {t(
              'Below are the details of your reward balances, once you click "Claim rewards" the rewarded tokens will be added to your wallet.'
            )}
          </p>
          <div className={styles.tableContainer}>
            <Table
              isLoading={!rewards}
              showHeader
              header={rewardsClaimableHeader}
              additionalRowProps={{ rewardsClaimableHeader }}
              headerClassName={styles.tableHeader}
              data={rewards || []}
              row={RewardsClaimableRow}
            />
          </div>
        </>
      </TxComposer>
    </section>
  );
};

export default ClaimRewardsForm;
