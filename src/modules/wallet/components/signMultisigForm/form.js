/* eslint-disable complexity */
import React, { useState, useEffect } from 'react';
import {
  transformTransaction,
  createTransactionObject,
} from '@transaction/utils/transaction';
import { joinModuleAndAssetIds } from '@transaction/utils/moduleAssets';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import BoxFooter from 'src/theme/box/footer';
import UploadJSONInput from 'src/modules/common/components/uploadJSONInput';
import { PrimaryButton } from 'src/theme/buttons';
import { validateTransaction } from '@liskhq/lisk-transactions';
import ProgressBar from '../signMultisigView/progressBar';
import styles from './styles.css';

const reader = new FileReader();

const Form = ({ t, nextStep, network }) => {
  const [transaction, setTransaction] = useState();
  const [error, setError] = useState();

  const onReview = () => {
    try {
      nextStep({ transaction: transformTransaction(transaction) });
    } catch (e) {
      nextStep({ error: e });
    }
  };

  // eslint-disable-next-line max-statements
  const validateAndSetTransaction = (value) => {
    try {
      setTransaction(value);
      const moduleAssetId = joinModuleAndAssetIds({
        moduleID: value.moduleID,
        assetID: value.assetID,
      });

      const schema = network.networks.LSK.moduleAssetSchemas[moduleAssetId];
      const transformedTransaction = transformTransaction(value);
      const transactionObject = createTransactionObject(
        transformedTransaction,
        moduleAssetId,
      );
      const err = validateTransaction(schema, transactionObject);
      setError(err ? 'Unknown transaction' : undefined);
    } catch (e) {
      setTransaction(undefined);
      setError('Invalid transaction');
    }
  };

  useEffect(() => {
    reader.onload = ({ target }) => {
      validateAndSetTransaction(target.result);
    };
  }, []);

  return (
    <section>
      <Box className={styles.boxContainer}>
        <header>
          <h1>{t('Sign multisignature transaction')}</h1>
          <p>
            {t(
              'Provide a signature for a transaction which belongs to a multisignature account.',
            )}
          </p>
        </header>
        <BoxContent>
          <ProgressBar current={1} />
          <UploadJSONInput
            prefixLabel={`${t('Paste transaction value')}  `}
            label={t('Read from JSON file')}
            onChange={validateAndSetTransaction}
            value={transaction}
            error={error}
          />
        </BoxContent>
        <BoxFooter className={styles.footer}>
          <PrimaryButton
            className="confirm"
            size="l"
            onClick={onReview}
            disabled={!transaction || error}
          >
            {t('Review and sign')}
          </PrimaryButton>
        </BoxFooter>
      </Box>
    </section>
  );
};

export default Form;
