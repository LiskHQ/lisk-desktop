import functionMapper from '@common/utilities/api/functionMapper';
import * as lsk from './lsk';
import * as btc from './btc';

const searchAPI = functionMapper(lsk, btc);

// eslint-disable-next-line import/prefer-default-export
export const search = searchAPI.search;
