import { MODULE_ASSETS_NAME_ID_MAP } from '@constants';

import {
  TransactionId, Sender, Recipient, Message, Illustration,
  Confirmations, Date, Amount, Fee, RequiredSignatures, TransactionVotes,
  BlockId, BlockHeight, Members, SignedAndRemainingMembersList,
} from './components';
import styles from './transactionDetails.css';

const {
  transfer, voteDelegate, unlockToken, registerDelegate, registerMultisignatureGroup,
  // reclaimLSK,
} = MODULE_ASSETS_NAME_ID_MAP;

const baseComponents = [Sender, Confirmations, TransactionId, Fee, Date, BlockId, BlockHeight];
const previewBaseComponents = [Sender, TransactionId, Fee, SignedAndRemainingMembersList];

const LayoutSchema = {
  [transfer]: {
    components: [...baseComponents, Recipient, Illustration, Amount, Message],
    className: '',
  },
  [`${transfer}-preview`]: {
    components: [...previewBaseComponents, Recipient, Illustration, Amount, Message],
    className: styles.transferPreview,
  },
  [voteDelegate]: {
    components: [...baseComponents, Illustration, TransactionVotes],
    className: styles.voteLayout,
  },
  [`${voteDelegate}-preview`]: {
    components: [...previewBaseComponents, Illustration, TransactionVotes],
    className: styles.votePreview,
  },
  [registerDelegate]: {
    components: [...baseComponents, Illustration],
    className: styles.registerDelegate,
  },
  [`${registerDelegate}-preview`]: {
    components: [...previewBaseComponents],
    className: styles.registerDelegatePreview,
  },
  [registerMultisignatureGroup]: {
    components: [...baseComponents, RequiredSignatures, Members],
    className: styles.multiSigLayout,
  },
  [unlockToken]: {
    components: [...baseComponents, Illustration, Amount],
    className: styles.unlockToken,
  },
  default: {
    components: [...baseComponents],
    className: styles.generalLayout,
  },
};

export default LayoutSchema;
