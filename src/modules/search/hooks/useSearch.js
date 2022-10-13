/* eslint-disable complexity */
/* eslint-disable max-statements */
/* eslint-disable import/prefer-default-export */
import { API_VERSION } from "src/const/config";
import { regex } from "src/const/regex";
import { useCustomQuery } from "src/modules/common/hooks"
import { validateAddress } from "src/utils/validators";

export const useSearch = (search = '') => {

  const config = {
    method: 'get',
  };

  const isAddress = validateAddress(search) === 0
  const isTxId = regex.transactionId.test(search)
  const isBlockHeight = regex.blockHeight.test(search)

  const addressSearch = useCustomQuery({
    keys: ['address-key'],
    config: {
      ...config,
      url: `/api/${API_VERSION}/dpos/delegates`,
      event: 'get.address',
      params: { address: search }
    }, options: { enabled: isAddress }
  })
  const addresses = addressSearch.data?.data ?? [];

  const delegateSearch = useCustomQuery({
    keys: ['search-key'],
    config: {
      ...config,
      url: `/api/${API_VERSION}/dpos/delegates`,
      event: 'get.delegates',
      params: { search }
    }, options: { enabled: search.length >= 3 && !isAddress && !isTxId && !isBlockHeight }
  })
  const delegates = delegateSearch.data?.data ?? []

  const transactionsSearch = useCustomQuery({
    keys: ['address-key'],
    config: {
      ...config,
      url: `/api/${API_VERSION}/transactions`,
      event: 'get.transaction',
      params: { transactionID: search }
    }, options: { enabled: isTxId }
  })
  const transactions = transactionsSearch.data?.data ?? []

  const blochHeightSearch = useCustomQuery({
    keys: ['address-key'],
    config: {
      ...config,
      url: `/api/${API_VERSION}/blocks`,
      event: 'get.block',
      params: { height: search }
    }, options: { enabled: isBlockHeight }
  })

  const blocks = blochHeightSearch.data?.data ?? []

  const isLoading = delegateSearch.isLoading || transactionsSearch.isLoading || addressSearch.isLoading || blochHeightSearch.isLoading

  return { addresses, delegates, transactions, blocks, isLoading }
}