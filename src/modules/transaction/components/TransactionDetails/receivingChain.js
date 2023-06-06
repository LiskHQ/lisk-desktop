import React from 'react';
import { useBlockchainApplicationMeta } from '@blockchainApplication/manage/hooks/queries/useBlockchainApplicationMeta';
import { getLogo } from '@token/fungible/utils/helpers';
import TransactionDetailsContext from '../../context/transactionDetailsContext';
import ValueAndLabel from './valueAndLabel';
import styles from './styles.css';

const ReceivingChain = ({ t }) => {
  const {
    transaction: {
      params: { receivingChainID },
    },
  } = React.useContext(TransactionDetailsContext);
  const blockchainAppsMeta = useBlockchainApplicationMeta({
    config: {
      params: {
        chainID: receivingChainID,
      },
    },
    options: { enabled: !!receivingChainID },
  });
  const application = blockchainAppsMeta.data?.data?.[0] || {};

  return (
    <ValueAndLabel label={t('Receiving Chain')}>
      <span className={styles.receivingChainID}>
        <img className={styles.chainLogo} src={getLogo(application)} alt="To application logo" />
        <span>{application.chainName}</span>
      </span>
    </ValueAndLabel>
  );
};

export default ReceivingChain;
