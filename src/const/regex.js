// eslint-disable-next-line import/prefer-default-export
export const regex = {
  address: /^lsk[a-z0-9]{0,38}$/,
  legacyAddress: /^[1-9]\d{0,19}L$/,
  publicKey: /^[0-9a-f]{64}$/,
  username: /^[a-z0-9!@$&_.]{3,20}$/,
  delegateName: /^[a-z0-9!@$&_.]{3,20}$/,
  transactionId: /^[0-9a-z]{64}/,
  blockId: /^[0-9a-z]{64}/,
  blockHeight: /^[0-9]+$/,
  truncate: {
    small: /^(.{6})(.+)?(.{5})$/,
    medium: /\b((bc|tb)(0([ac-hj-np-z02-9]{39}|[ac-hj-np-z02-9]{59})|1[ac-hj-np-z02-9]{8,87})|([13]|[mn2])[a-km-zA-HJ-NP-Z1-9]{25,39})\b/,
  },
  lskAddressTrunk: /^(.{6})(.+)?(.{5})$/,
  publicKeyTrunk: /^(.{6})(.+)?(.{5})$/,
  delegateSpecialChars: /[a-z0-9!@$&_.]+/g,
  htmlElements: /<(\w+).*?>([\s\S]*?)<\/\1>(.*)/,
  releaseSummary: /<h4>([\s\S]*?)<\/h4>/i,
  searchbar: /^(.{9})(.+)$/,
  amount: {
    en: {
      format: /[^\d.]|(.*?\.){2}|\.$/,
      maxFloating: /\.[\d\w\s]{9}/,
      leadingPoint: /^\./,
    },
    de: {
      format: /[^\d,]|(.*?[,]){2}|[,]$/,
      maxFloating: /[,][\d\w\s]{9}/,
      leadingPoint: /^[,]/,
    },
  },
  url: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/,
};
