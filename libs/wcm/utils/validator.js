import qs from 'qs';
import { parseRelayParams } from '@walletconnect/utils';

const parseWalletConnectUri = (uri) => {
  // Handle wc:{} and wc://{} format
  const str = uri.startsWith('wc://') ? uri.replace('wc://', 'wc:') : uri;
  const pathStart = str.indexOf(':');
  const pathEnd = str.indexOf('?') !== -1 ? str.indexOf('?') : undefined;
  const protocol = str.substring(0, pathStart);
  const path = str.substring(pathStart + 1, pathEnd);
  const requiredValues = path.split('@');

  const queryString = typeof pathEnd !== 'undefined' ? str.substring(pathEnd) : '';
  const queryParams = qs.parse(queryString);
  const result = {
    protocol,
    topic: requiredValues[0],
    version: parseInt(requiredValues[1], 10),
    symKey: queryParams.symKey,
    relay: parseRelayParams(queryParams),
    bridge: queryParams.bridge,
    key: queryParams.key,
    handshakeTopic: queryParams.handshakeTopic,
  };

  return result;
};

export const isValidWCURI = (uri) => {
  const result = parseWalletConnectUri(uri);

  return !(!result.topic || !result.symKey || !result.relay);
};
