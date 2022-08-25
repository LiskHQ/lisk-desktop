import * as common from 'src/modules/common/mocks';
import * as auth from '@auth/mocks';
import * as blocks from '@block/mocks';
import * as legacy from '@legacy/mocks';
import * as network from '@network/mocks';
import * as tokens from '@token/fungible/mocks';
import * as transaction from '@transaction/mocks';
import * as dposValidators from '@dpos/validator/mocks';
import * as blockchainApplicationExplore from '@blockchainApplication/explore/mocks';
import * as blockchainApplicationManage from '@blockchainApplication/manage/mocks';

export default [
  ...Object.values(auth),
  ...Object.values(blocks),
  ...Object.values(common),
  ...Object.values(dposValidators),
  ...Object.values(legacy),
  ...Object.values(network),
  ...Object.values(tokens),
  ...Object.values(transaction),
  ...Object.values(blockchainApplicationExplore),
  ...Object.values(blockchainApplicationManage),
];
