import * as blocks from '@block/mocks';
import * as network from '@network/mocks';
import * as transactions from '@transaction/mocks';

export default [
  ...Object.values(blocks),
  ...Object.values(network),
  ...Object.values(transactions),
];
