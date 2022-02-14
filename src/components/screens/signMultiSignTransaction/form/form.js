/* eslint-disable complexity */
import React, { useState, useEffect } from 'react';
import { transformTransaction, createTransactionObject, flattenTransaction } from '@utils/transaction';
import { joinModuleAndAssetIds } from '@utils/moduleAssets';
import Box from '@toolbox/box';
import BoxContent from '@toolbox/box/content';
import BoxFooter from '@toolbox/box/footer';
import { PrimaryButton } from '@toolbox/buttons';
import Feedback from '@toolbox/feedback/feedback';
import { validateTransaction } from '@liskhq/lisk-transactions';
import ProgressBar from '../progressBar';
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
  const validateAndSetTransaction = (input) => {
    try {
      const parsedInput = JSON.parse(input);
      setTransaction(parsedInput);
      const moduleAssetId = joinModuleAndAssetIds({
        moduleID: parsedInput.moduleID,
        assetID: parsedInput.assetID,
      });

      const schema = network.networks.LSK.moduleAssetSchemas[moduleAssetId];
      const transformedTransaction = transformTransaction(parsedInput);
      const flattenedTransaction = flattenTransaction(transformedTransaction);
      const transactionObject = createTransactionObject(flattenedTransaction, moduleAssetId);
      const err = validateTransaction(schema, transactionObject);

      if (err) {
        throw Error('Unknown transaction');
      }
      setError(undefined);
    } catch (e) {
      setTransaction(undefined);
      setError('Invalid transaction');
    }
  };

  const onFileInputChange = ({ target }) => reader.readAsText(target.files[0]);
  const onPaste = (evt) => {
    const paste = evt.clipboardData.getData('text');
    validateAndSetTransaction(paste);
  };

  useEffect(() => {
    reader.onload = ({ target }) => {
      validateAndSetTransaction(target.result);
    };
    // const tx = '{"moduleID":4,"assetID":0,"senderPublicKey":"a04a60f5f3f9be3a15b121342ba81b7bd66d37e7f3e8cc4f7c03396bd9c1f103","nonce":"0n","fee":"414000n","signatures":["89c380e42226cbcdf8738390cdcd215521348e50f27e21767baa7f88d91d86fd87949d01b11f82afe865b025222f33d3c1c72a0b4f0122d9cc77513bbcc03b0d","89c380e42226cbcdf8738390cdcd215521348e50f27e21767baa7f88d91d86fd87949d01b11f82afe865b025222f33d3c1c72a0b4f0122d9cc77513bbcc03b0d","",""],"asset":{"numberOfSignatures":2,"mandatoryKeys":["a04a60f5f3f9be3a15b121342ba81b7bd66d37e7f3e8cc4f7c03396bd9c1f103"],"optionalKeys":["0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a","86499879448d1b0215d59cbf078836e3d7d9d2782d56a2274a568761bff36f19"]},"id":"9ae1254b9333e4a103dc2c49c596d7d55013d46e18043a95c1b9d1319d84c83c"}';
    // const tx = '{"moduleID":4,"assetID":0,"senderPublicKey":"a04a60f5f3f9be3a15b121342ba81b7bd66d37e7f3e8cc4f7c03396bd9c1f103","nonce":"0n","fee":"414000n","signatures":["89c380e42226cbcdf8738390cdcd215521348e50f27e21767baa7f88d91d86fd87949d01b11f82afe865b025222f33d3c1c72a0b4f0122d9cc77513bbcc03b0d","89c380e42226cbcdf8738390cdcd215521348e50f27e21767baa7f88d91d86fd87949d01b11f82afe865b025222f33d3c1c72a0b4f0122d9cc77513bbcc03b0d","336541438f0f81019c05af132600defea2f235525022e24a1b4184e71674233f7df7463ed739a4624dcd351b1e344707ea2a3953c003b7ecb1e5a632b58cae00",""],"asset":{"numberOfSignatures":2,"mandatoryKeys":["a04a60f5f3f9be3a15b121342ba81b7bd66d37e7f3e8cc4f7c03396bd9c1f103"],"optionalKeys":["0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a","86499879448d1b0215d59cbf078836e3d7d9d2782d56a2274a568761bff36f19"]},"id":"f0ea4fb53ba647715fc5a11a36bbbe6edb8026e7b476b5b287e3a4452bef3289"}';
    const tx = '{"moduleID":4,"assetID":0,"senderPublicKey":"0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a","nonce":"144n","fee":"315000n","signatures":["7638e53baaaae45034c6fbff6a85883fb937604c25bdfbdfaedd7b053063adbb48939556eb130e58982fd106cb60de56978c669b19840ddfb0eba1d9ee950201","7638e53baaaae45034c6fbff6a85883fb937604c25bdfbdfaedd7b053063adbb48939556eb130e58982fd106cb60de56978c669b19840ddfb0eba1d9ee950201",""],"asset":{"numberOfSignatures":2,"mandatoryKeys":["0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a","86499879448d1b0215d59cbf078836e3d7d9d2782d56a2274a568761bff36f19"],"optionalKeys":[]},"id":"41218da5ebf4f8151656a7dd4ca219329af9e50c40fe2193d86ea9668cbf7d4c"}';
    validateAndSetTransaction(tx);
  }, []);

  return (
    <section>
      <Box className={styles.boxContainer}>
        <header>
          <h1>{t('Sign multisignature transaction')}</h1>
          <p>{t('Provide a signature for a transaction which belongs to a multisignature account.')}</p>
        </header>
        <BoxContent>
          <ProgressBar current={1} />
          <p className={styles.fileInputLabel}>
            {t('Paste transaction value')}
            <label className={styles.fileInputBtn}>
              {t('Read from JSON file')}
              <input
                className={`${styles.input} clickableFileInput`}
                type="file"
                accept="application/JSON"
                onChange={onFileInputChange}
              />
            </label>
          </p>
          <div className={`${styles.textAreaContainer} ${error && styles.error} ${transaction && styles.filled}`}>
            <textarea
              onPaste={onPaste}
              value={transaction ? JSON.stringify(transaction) : ''}
              readOnly
              className={styles.txInput}
            />
            <Feedback
              message={error}
              size="m"
              status={error ? 'error' : 'ok'}
            />
          </div>
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
