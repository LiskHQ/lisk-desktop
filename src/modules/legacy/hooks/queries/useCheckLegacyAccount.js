import { useLegacy } from '@legacy/hooks/queries';

export default function useCheckLegacyAccount(address) {
  const { data: { data: legacyData } = {} } = useLegacy({
    config: { params: { publicKey: address } },
    options: { enabled: !!address },
  });
  return {
    isMigrated: legacyData ? legacyData.balance === '0' : true,
  };
}
