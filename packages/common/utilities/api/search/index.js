import * as lsk from '@token/utilities/lsk';
import functionMapper from '@common/utilities/api/functionMapper';
import * as btc from './btc';

const searchAPI = functionMapper(lsk, btc);

// eslint-disable-next-line import/prefer-default-export
export const search = searchAPI.search;
