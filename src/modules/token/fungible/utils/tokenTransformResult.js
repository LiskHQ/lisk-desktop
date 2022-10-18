import { clientMetaData } from 'src/utils/api/client';

export const tokenTransformResult = ({createMetaConfig}) => async (res) => {
  const tokenIDs = res?.data?.map(({ tokenID }) => tokenID).join(',');
  if (!tokenIDs) {
    return res;
  }
  const metaConfig = createMetaConfig({ params: { tokenID: tokenIDs, limit: 100 } });
  const metaRes = await clientMetaData.call(metaConfig);
  return {
    ...res,
    data: res?.data?.map((token) => {
      const selectedTokenMeta = metaRes?.data?.find(
        (tokenMeta) => tokenMeta.tokenID === token.tokenID
      ) ?? {};
      return { ...selectedTokenMeta, ...token};
    }),
  };
};
