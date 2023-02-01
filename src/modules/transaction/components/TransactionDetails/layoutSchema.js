import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';

import {
  TransactionId, Sender, Recipient, Message, Illustration,
  Confirmations, TxDate, Amount, Fee, NumberOfSignatures, Stakes,
  BlockId, BlockHeight, Members, SignedAndRemainingMembersList, PrettyJson,
} from 'src/modules/transaction/components/TransactionDetails';
import styles from './layoutSchema.css';

const {
  transfer, stakeValidator, unlock, registerValidator, registerMultisignature,
  reportValidatorMisbehavior, reclaim,
} = MODULE_COMMANDS_NAME_MAP;

const baseComponents = [Illustration, Sender];
const timeComponents = [TransactionId, TxDate, BlockId, BlockHeight, Fee, Confirmations];
const previewBaseComponents = [Illustration, Sender];
const restComponents = [TransactionId, Fee, SignedAndRemainingMembersList];

export const LayoutSchema = {
  [transfer]: {
    components: [...baseComponents, Recipient, Amount, Message, ...timeComponents, PrettyJson],
    className: styles.transferLayout,
  },
  [`${transfer}-preview`]: {
    components: [...previewBaseComponents, Recipient, Amount, Message, ...restComponents],
    className: styles.transferPreview,
  },
  [stakeValidator]: {
    components: [...baseComponents, ...timeComponents, Stakes, PrettyJson],
    className: styles.stakeLayout,
  },
  [`${stakeValidator}-preview`]: {
    components: [...previewBaseComponents, Stakes, ...restComponents],
    className: styles.stakePreview,
  },
  [registerValidator]: {
    components: [...baseComponents, ...timeComponents, PrettyJson],
    className: styles.registerValidator,
  },
  [`${registerValidator}-preview`]: {
    components: [...previewBaseComponents, ...restComponents],
    className: styles.registerValidatorPreview,
  },
  [registerMultisignature]: {
    components: [...baseComponents, ...timeComponents, Members, NumberOfSignatures, PrettyJson],
    className: styles.multiSigLayout,
  },
  [`${registerMultisignature}-preview`]: {
    components: [...previewBaseComponents, Members, NumberOfSignatures, ...restComponents],
    className: styles.multiSigRegisterPreview,
  },
  [unlock]: {
    components: [...baseComponents, Amount, ...timeComponents, PrettyJson],
    className: styles.unlockToken,
  },
  [`${unlock}-preview`]: {
    components: [...previewBaseComponents, Amount, ...restComponents],
    className: styles.unlockTokenPreview,
  },
  [reportValidatorMisbehavior]: {
    components: [...baseComponents, ...timeComponents, PrettyJson],
    className: styles.reportValidatorMisbehavior,
  },
  [reclaim]: {
    components: [...baseComponents, ...timeComponents, Amount, PrettyJson],
    className: styles.reclaimLSK,
  },
  default: {
    components: [...baseComponents, PrettyJson],
    className: styles.generalLayout,
  },
};

export default LayoutSchema;
