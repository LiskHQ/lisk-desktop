/* eslint-disable complexity */
import React, { useState } from 'react';
import { fromTransactionJSON } from '@transaction/utils/encoding';
import { joinModuleAndCommand } from '@transaction/utils/moduleCommand';
import { useCommandSchema } from '@network/hooks';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import BoxFooter from 'src/theme/box/footer';
import UploadJSONInput from 'src/modules/common/components/uploadJSONInput';
import { PrimaryButton } from 'src/theme/buttons';
import { useDeprecatedAccount } from 'src/modules/account/hooks';
import { useSchemas } from '@transaction/hooks/queries/useSchemas';
import { transactions } from '@liskhq/lisk-client';
import { getParamsSchema } from '@transaction/hooks/useTransactionFee/utils';
import ProgressBar from '../signMultisigView/progressBar';
import styles from './styles.css';

// eslint-disable-next-line max-statements
const Form = ({ t, nextStep }) => {
  const [transaction, setTransaction] = useState();
  const [error, setError] = useState();
  const { moduleCommandSchemas, isError, isFetching } = useCommandSchema();
  // @todo Once the transactions are refactored and working, we should
  // use the schema returned by this hook instead of reading from the Redux store.
  useSchemas();
  useDeprecatedAccount();

  const onReview = () => {
    try {
      const paramsSchema = getParamsSchema(transaction, moduleCommandSchemas);
      const transactionObject = fromTransactionJSON(transaction, paramsSchema);
      transactions.validateTransaction(transactionObject, paramsSchema);

      const moduleCommand = joinModuleAndCommand(transaction);
      const formProps = { moduleCommand };
      nextStep({ formProps, transactionJSON: transaction });
    } catch (e) {
      setTransaction(undefined);
      setError(`Invalid transaction: ${e.message}`);
    }
  };

  const handleJsonInputError = (inputError) => {
    setError(inputError.message);
  };

  const onLoad = () => {
    setError(undefined);
  };

  return (
    <section>
      <Box className={`${styles.boxContainer} ${styles.boxWrapper}`}>
        <header>
          <h1>{t('Sign multisignature transaction')}</h1>
          <p>
            {t(
              'If you have received a multisignature transaction that requires your signature, use this tool to review and sign it.'
            )}
          </p>
        </header>
        <BoxContent className={styles.contentWrapper}>
          <ProgressBar current={1} />
          <UploadJSONInput
            prefixLabel={`${t('Paste transaction value')}  `}
            label={t('Read from JSON file')}
            onChange={setTransaction}
            onLoad={onLoad}
            value={transaction}
            error={error}
            onError={handleJsonInputError}
          />
        </BoxContent>
        <BoxFooter className={styles.footer}>
          <PrimaryButton
            className="confirm"
            size="l"
            onClick={onReview}
            disabled={isFetching || isError}
          >
            {t('Review and sign')}
          </PrimaryButton>
        </BoxFooter>
      </Box>
    </section>
  );
};

export default Form;
