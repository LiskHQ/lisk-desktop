import transactionTypes from '../../../constants/transactionTypes';

import {
  TransactionId, Sender, Recipient, Message, Illustration,
  Confirmations, Date, Amount, Fee, RequiredSignatures, Nonce, TransactionVotes,
} from './components';
import styles from './transactionDetails.css';

const txTypes = transactionTypes();
const baseComponents = [Sender, Confirmations, TransactionId, Fee, Date, Nonce];

const LayoutSchema = {
  [txTypes.transfer.code.legacy]: {
    components: [...baseComponents, Recipient, Illustration, Amount, Message],
    className: '',
  },
  [txTypes.vote.code.legacy]: {
    components: [...baseComponents, Message, TransactionVotes],
    className: styles.voteLayout,
  },
  [txTypes.registerDelegate.code.legacy]: {
    components: [...baseComponents, Illustration],
    className: styles.registerDelegate,
  },
  [txTypes.createMultiSig.code.legacy]: {
    components: [...baseComponents, Recipient, RequiredSignatures, Amount, Message],
    className: styles.multiSigLayout,
  },
  default: {
    components: [...baseComponents],
    className: styles.generalLayout,
  },
};

export default LayoutSchema;
