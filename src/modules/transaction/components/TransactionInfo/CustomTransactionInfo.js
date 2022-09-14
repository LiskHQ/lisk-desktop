import React from 'react';
import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import VoteDelegate from '../VoteDelegate';
import Reclaim from '../Reclaim';
import Send from '../Send';
import RegisterDelegate from '../RegisterDelegate';
import UnlockBalance from '../UnlockBalance';
import RegisterMultisignatureGroup from '../RegisterMultisignatureGroup';

export default (props) => {
  switch (props.transaction.moduleCommand) {
    case MODULE_COMMANDS_NAME_MAP.reclaim: return <Reclaim {...props} />;
    case MODULE_COMMANDS_NAME_MAP.registerDelegate: return <RegisterDelegate {...props} />;
    case MODULE_COMMANDS_NAME_MAP.transfer: return <Send {...props} />;
    case MODULE_COMMANDS_NAME_MAP.voteDelegate: return <VoteDelegate {...props} />;
    case MODULE_COMMANDS_NAME_MAP.unlock: return <UnlockBalance {...props} />;
    case MODULE_COMMANDS_NAME_MAP.registerMultisignatureGroup:
      return <RegisterMultisignatureGroup {...props} />;
    default:
      return null;
  }
};
