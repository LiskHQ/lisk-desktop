import { useLegacy } from '@legacy/hooks/queries';

export default function useCheckLegacyAccount(address) {
  const { data } = useLegacy({ config: { params: { publicKey: address } } });
  return {
    isMigrated: data ? data.data.balance === '0' : true,
  };
}
