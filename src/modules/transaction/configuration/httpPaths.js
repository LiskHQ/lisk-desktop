import { HTTP_PREFIX } from 'src/const/httpCodes';

export default {
  fees: `${HTTP_PREFIX}/fees`,
  transactions: `${HTTP_PREFIX}/transactions`,
  dryRun: `${HTTP_PREFIX}/transactions/dryrun`,
  transaction: `${HTTP_PREFIX}/transactions`,
  transactionStats: `${HTTP_PREFIX}/transactions/statistics`,
  schemas: `${HTTP_PREFIX}/transactions/schemas`,
};
