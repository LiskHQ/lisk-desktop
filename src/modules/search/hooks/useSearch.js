/* eslint-disable complexity, max-statements, import/prefer-default-export */
import { useMemo } from "react";
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
      url: `/api/${API_VERSION}/pos/validators`,
      event: 'get.address',
      params: { address: search }
    }, options: { enabled: isAddress }
  })
  const addresses = useMemo(() =>  addressSearch.data?.data ?? [], [addressSearch.data?.data])

  const validatorSearch = useCustomQuery({
    keys: ['search-key'],
    config: {
      ...config,
      url: `/api/${API_VERSION}/pos/validators`,
      event: 'get.validators',
      params: { search }
    }, options: { enabled: search.length >= 3 && !isAddress && !isTxId && !isBlockHeight }
  })
  const validators = useMemo(() =>  validatorSearch.data?.data ?? [], [validatorSearch.data?.data])

  const transactionsSearch = useCustomQuery({
    keys: ['transactions-key'],
    config: {
      ...config,
      url: `/api/${API_VERSION}/transactions`,
      event: 'get.transaction',
      params: { transactionID: search }
    }, options: { enabled: isTxId }
  })
  const transactions = useMemo(() =>  transactionsSearch.data?.data ?? [], [transactionsSearch.data?.data])

  const blockHeightSearch = useCustomQuery({
    keys: ['block-key'],
    config: {
      ...config,
      url: `/api/${API_VERSION}/blocks`,
      event: 'get.block',
      params: { height: search }
    }, options: { enabled: isBlockHeight }
  })

  const blocks = useMemo(() =>  blockHeightSearch.data?.data ?? [], [blockHeightSearch.data?.data])

  const isLoading = validatorSearch.isLoading || transactionsSearch.isLoading || addressSearch.isLoading || blockHeightSearch.isLoading

  return { addresses, validators, transactions, blocks, isLoading }
}
