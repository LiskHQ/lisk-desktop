import { MODULE_ASSETS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';

import {
  TransactionId, Sender, Recipient, Message, Illustration,
  Confirmations, Date, Amount, Fee, RequiredSignatures, TransactionVotes,
  BlockId, BlockHeight, Members, SignedAndRemainingMembersList, PrettyJson,
} from '@transaction/detail/info/transactionDetailsComponents';
import styles from '@screens/managers/transactionDetails/transactionDetails.css';

const {
  transfer, voteDelegate, unlockToken, registerDelegate, registerMultisignatureGroup,
  reportDelegateMisbehavior, reclaimLSK,
} = MODULE_ASSETS_NAME_ID_MAP;

const baseComponents = [Illustration, Sender];
const timeComponents = [TransactionId, Date, BlockId, BlockHeight, Fee, Confirmations];
const previewBaseComponents = [Illustration, Sender];
const restComponents = [TransactionId, Fee, SignedAndRemainingMembersList];

const LayoutSchema = {
  [transfer]: {
    components: [...baseComponents, Recipient, Amount, Message, ...timeComponents, PrettyJson],
    className: styles.transferLayout,
  },
  [`${transfer}-preview`]: {
    components: [...previewBaseComponents, Recipient, Amount, Message, ...restComponents],
    className: styles.transferPreview,
  },
  [voteDelegate]: {
    components: [...baseComponents, ...timeComponents, TransactionVotes, PrettyJson],
    className: styles.voteLayout,
  },
  [`${voteDelegate}-preview`]: {
    components: [...previewBaseComponents, TransactionVotes, ...restComponents],
    className: styles.votePreview,
  },
  [registerDelegate]: {
    components: [...baseComponents, ...timeComponents, PrettyJson],
    className: styles.registerDelegate,
  },
  [`${registerDelegate}-preview`]: {
    components: [...previewBaseComponents, ...restComponents],
    className: styles.registerDelegatePreview,
  },
  [registerMultisignatureGroup]: {
    components: [...baseComponents, ...timeComponents, Members, RequiredSignatures, PrettyJson],
    className: styles.multiSigLayout,
  },
  [`${registerMultisignatureGroup}-preview`]: {
    components: [...previewBaseComponents, Members, RequiredSignatures, ...restComponents],
    className: styles.multiSigRegisterPreview,
  },
  [unlockToken]: {
    components: [...baseComponents, Amount, ...timeComponents, PrettyJson],
    className: styles.unlockToken,
  },
  [`${unlockToken}-preview`]: {
    components: [...previewBaseComponents, Amount, ...restComponents],
    className: styles.unlockTokenPreview,
  },
  [reportDelegateMisbehavior]: {
    components: [...baseComponents, ...timeComponents, PrettyJson],
    className: styles.reportDelegateMisbehavior,
  },
  [reclaimLSK]: {
    components: [...baseComponents, ...timeComponents, Amount, PrettyJson],
    className: styles.reclaimLSK,
  },
  default: {
    components: [...baseComponents, PrettyJson],
    className: styles.generalLayout,
  },
};

export default LayoutSchema;
