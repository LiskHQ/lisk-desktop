export const addTokensMetaData =
  ({ createMetaConfig, client }) =>
  async (tokens) => {
    try {
      const tokenIDs = tokens?.map(({ tokenID }) => tokenID).join(',');
      if (!tokenIDs) {
        return tokens;
      }
      const metaConfig = createMetaConfig({
        params: {
          tokenID: tokenIDs,
          limit: tokens.length,
          chainID: null, // Omit chainID while fetching all token metadata for a given network
        },
      });
      const metaRes = await client.call(metaConfig);
      return tokens.map((token) => {
        const selectedTokenMeta = metaRes?.data?.find(
          (tokenMeta) => tokenMeta.tokenID === token.tokenID
        );
        return { ...(selectedTokenMeta ?? {}), ...token };
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('meta tokens Error:', e);
      return tokens;
    }
  };
