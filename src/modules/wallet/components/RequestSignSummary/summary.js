/* eslint-disable complexity */
/* eslint-disable max-statements */
import React from 'react';
import BoxContent from 'src/theme/box/content';
import Box from 'src/theme/box';
import Footer from '@transaction/components/TxSummarizer/footer';
import { LayoutSchema } from '@transaction/components/TransactionDetails/layoutSchema';
import TransactionDetailsContext from '@transaction/context/transactionDetailsContext';
import layoutSchemaStyles from '@transaction/components/TransactionDetails/layoutSchema.css';
import { joinModuleAndCommand } from 'src/modules/transaction/utils';
import BlockchainAppDetailsHeader from '@blockchainApplication/explore/components/BlockchainAppDetailsHeader';
import { useBlockchainApplicationMeta } from '@blockchainApplication/manage/hooks/queries/useBlockchainApplicationMeta';
import styles from './styles.css';

const RequestSignSummary = ({
  t,
  transactionJSON,
  actionFunction,
  formProps,
  nextStep,
  prevStep,
}) => {
  const confirmButton = {
    label: t('Sign'),
    onClick: () => {
      nextStep({
        formProps,
        transactionJSON,
        selectedPriority: 'normal',
        actionFunction,
      });
    },
  };
  const cancelButton = {
    label: t('Go back'),
    onClick: () => {
      prevStep({ formProps });
    },
  };
  const chainID = formProps.chainID;
  const blockchainApplicationMeta = useBlockchainApplicationMeta({
    config: { params: { chainID } },
    options: { enabled: !!chainID },
  });

  const { chainName, networkType, logo, projectPage } = blockchainApplicationMeta?.data?.data?.[0];
  const name = `${chainName} (${networkType})`;

  const Layout = LayoutSchema.structuredGeneralLayout;

  const application = {
    data: {
      name,
      projectPage,
      icon: logo?.png,
    },
  };

  return (
    <Box className={styles.boxContainer}>
      <BlockchainAppDetailsHeader
        headerText={t('Transaction summary')}
        application={application}
        clipboardCopyItems={[{ label: t('Chain ID:'), value: chainID }]}
        description={t('Please review and verify the transaction details before signing.')}
        classNameDescription={styles.description}
      />
      <BoxContent>
        <Box className={`${styles.container} ${styles.txDetails}`}>
          <BoxContent className={`${layoutSchemaStyles.mainContent} ${Layout.className}`}>
            <TransactionDetailsContext.Provider
              value={{
                transaction: {
                  ...transactionJSON,
                  moduleCommand: joinModuleAndCommand(transactionJSON),
                },
              }}
            >
              {Layout.components.map((Component, index) => (
                <Component key={index} t={t} />
              ))}
            </TransactionDetailsContext.Provider>
          </BoxContent>
        </Box>
        <Footer cancelButton={cancelButton} confirmButton={confirmButton} t={t} />
      </BoxContent>
    </Box>
  );
};
export default RequestSignSummary;
