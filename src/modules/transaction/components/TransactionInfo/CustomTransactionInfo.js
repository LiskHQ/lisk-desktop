import React from 'react';
import { MODULE_COMMANDS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import VoteDelegate from '../VoteDelegate';
import Reclaim from '../Reclaim';
import Send from '../Send';
import RegisterDelegate from '../RegisterDelegate';
import UnlockBalance from '../UnlockBalance';
import RegisterMultisignatureGroup from '../RegisterMultisignatureGroup';

export default (props) => {
  switch (props.transaction.moduleCommandID) {
    case MODULE_COMMANDS_NAME_ID_MAP.reclaimLSK:
      return <Reclaim {...props} />;
    case MODULE_COMMANDS_NAME_ID_MAP.registerDelegate:
      return <RegisterDelegate {...props} />;
    case MODULE_COMMANDS_NAME_ID_MAP.transfer:
      return <Send {...props} />;
    case MODULE_COMMANDS_NAME_ID_MAP.voteDelegate:
      return <VoteDelegate {...props} />;
    case MODULE_COMMANDS_NAME_ID_MAP.unlockToken:
      return <UnlockBalance {...props} />;
    case MODULE_COMMANDS_NAME_ID_MAP.registerMultisignatureGroup:
      return <RegisterMultisignatureGroup {...props} />;
    default:
      return null;
  }
};
