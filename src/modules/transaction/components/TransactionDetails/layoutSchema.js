import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';

import {
  TransactionId,
  Sender,
  Recipient,
  Message,
  Illustration,
  Confirmations,
  TxDate,
  Amount,
  Fee,
  NumberOfSignatures,
  Stakes,
  BlockId,
  BlockHeight,
  Members,
  SignedAndRemainingMembersList,
  PrettyJson,
  Command,
  Module,
  Nonce,
  GenericParams,
} from 'src/modules/transaction/components/TransactionDetails';
import styles from './layoutSchema.css';

const {
  transfer,
  stakeValidator,
  unlock,
  registerValidator,
  registerMultisignature,
  reportMisbehavior,
  reclaimLSK,
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
    components: [Sender, Fee, Members, NumberOfSignatures, PrettyJson],
    className: styles.multiSigLayout,
  },
  [`${registerMultisignature}-preview`]: {
    components: [Sender, Members, NumberOfSignatures, Fee, SignedAndRemainingMembersList],
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
  [reportMisbehavior]: {
    components: [...baseComponents, ...timeComponents, PrettyJson],
    className: styles.reportValidatorMisbehavior,
  },
  [reclaimLSK]: {
    components: [...baseComponents, ...timeComponents, Amount, PrettyJson],
    className: styles.reclaimLSK,
  },
  structuredGeneralLayout: {
    components: [Module, Command, Sender, TransactionId, Fee, Nonce, GenericParams],
    className: styles.structuredGeneralLayout,
  },
  default: {
    components: [...baseComponents, PrettyJson],
    className: styles.generalLayout,
  },
};

export default LayoutSchema;
