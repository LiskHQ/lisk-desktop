import * as lsk from '@token/utilities/lsk';
import * as btc from './btc';
import functionMapper from '@common/utilities/api/functionMapper';

const searchAPI = functionMapper(lsk, btc);

// eslint-disable-next-line import/prefer-default-export
export const search = searchAPI.search;
