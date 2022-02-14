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
    // const tx = '{"moduleID":4,"assetID":0,"senderPublicKey":"0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a","nonce":"132n","fee":"415000n","signatures":["530ef950c8f453b66d9a1f9fe96c6d899d7449dcdd600867c9d04ab6fcab17880812f2a18db99bf25bdde10f7e2c4284ce57100498025015a2e4fb2bb5d5ec09","530ef950c8f453b66d9a1f9fe96c6d899d7449dcdd600867c9d04ab6fcab17880812f2a18db99bf25bdde10f7e2c4284ce57100498025015a2e4fb2bb5d5ec09","",""],"asset":{"numberOfSignatures":2,"mandatoryKeys":["0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a"],"optionalKeys":["86499879448d1b0215d59cbf078836e3d7d9d2782d56a2274a568761bff36f19","a04a60f5f3f9be3a15b121342ba81b7bd66d37e7f3e8cc4f7c03396bd9c1f103"]},"id":"3ac5c3faa0a2e45a877c2b707c94ba1e14bc6ec2f53b23e805fe10706472584b"}';
    const tx = '{"moduleID":4,"assetID":0,"senderPublicKey":"0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a","nonce":"132n","fee":"415000n","signatures":["530ef950c8f453b66d9a1f9fe96c6d899d7449dcdd600867c9d04ab6fcab17880812f2a18db99bf25bdde10f7e2c4284ce57100498025015a2e4fb2bb5d5ec09","530ef950c8f453b66d9a1f9fe96c6d899d7449dcdd600867c9d04ab6fcab17880812f2a18db99bf25bdde10f7e2c4284ce57100498025015a2e4fb2bb5d5ec09","","b18f42885661777fc9f46e0778a9621bae9d6acbafbe17d3e91b5fbdf224170fc11074f0b5a744cfe771a615f2dc1597848fd9048233d3f69347b476d533b104"],"asset":{"numberOfSignatures":2,"mandatoryKeys":["0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a"],"optionalKeys":["86499879448d1b0215d59cbf078836e3d7d9d2782d56a2274a568761bff36f19","a04a60f5f3f9be3a15b121342ba81b7bd66d37e7f3e8cc4f7c03396bd9c1f103"]},"id":"5dd8ef18eebabddd4c2a3677fab69e306a69c0d8323f21054aa4a9e768ca207e"}';
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
