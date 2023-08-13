import { getTokenDecimals } from 'src/modules/token/fungible/utils/helpers';

export const regex = {
  address: /^lsk[a-z0-9]{0,38}$/,
  legacyAddress: /^[1-9]\d{0,19}L$/,
  publicKey: /^[0-9a-f]{64}$/,
  generatorKey: /^[0-9a-f]{64}$/,
  blsKey: /^[0-9a-f]{96}$/,
  proofOfPossession: /^[0-9a-f]{192}$/,
  name: /^[a-z0-9!@$&_.]{3,20}$/,
  networkName: /^\w[a-zA-Z\d-_\s]{1,18}\w$/,
  transactionId: /^[0-9a-z]{64}/,
  blockId: /^[0-9a-z]{64}/,
  blockHeight: /^[0-9]+$/,
  truncate: {
    small: /^(.{6})(.+)?(.{5})$/,
    medium:
      /\b((bc|tb)(0([ac-hj-np-z02-9]{39}|[ac-hj-np-z02-9]{59})|1[ac-hj-np-z02-9]{8,87})|([13]|[mn2])[a-km-zA-HJ-NP-Z1-9]{25,39})\b/,
  },
  lskAddressTrunk: /^(.{6})(.+)?(.{5})$/,
  publicKeyTrunk: /^(.{6})(.+)?(.{5})$/,
  validatorSpecialChars: /[a-z0-9!@$&_.]+/g,
  htmlElements: /<(\w+).*?>([\s\S]*?)<\/\1>(.*)/,
  releaseSummary: /<h4>([\s\S]*?)<\/h4>/i,
  searchbar: /^(.{9})(.+)$/,
  amount: {
    en: {
      format: /[^\d.]|(.*?\.){2}|\.$/,
      leadingPoint: /^\./,
      maxDecimals: (token) => {
        const decimals = getTokenDecimals(token) || 8;
        return new RegExp(`\\.[\\d\\w\\s]{${decimals + 1}}`);
      },
    },
    de: {
      format: /[^\d,]|(.*?[,]){2}|[,]$/,
      leadingPoint: /^[,]/,
      maxDecimals: (token) => {
        const decimals = getTokenDecimals(token) || 8;
        return new RegExp(`\\.[\\d\\w\\s]{${decimals + 1}}`);
      },
    },
  },
  url: /https?:\/\/(((www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6})|localhost)\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/,
  webSocketUrl: /^wss?:\/\/[\w.-]+(:\d+)?(\/[\w-./?%&=]*)?$/,
  accountName: /^[a-zA-Z0-9!@$&_.]+$/,
  password: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
};
