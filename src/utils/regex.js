export default {
  address: /^lsk[a-z0-9]{0,38}$/,
  publicKey: /^[0-9a-f]{64}$/,
  delegateName: /^[a-z0-9!@$&_.]{3,20}$/,
  transactionId: /^[1-9]\d{0,19}$/,
  blockId: /^[1-9]\d{0,19}$/,
  btcAddressTrunk: /^(.{10})(.+)?(.{10})$/,
  lskAddressTrunk: /^(.{6})(.+)?(.{5})$/,
  btcTransactionId: /^[a-fA-F0-9]{64}$/,
  btcAddress: /\b((bc|tb)(0([ac-hj-np-z02-9]{39}|[ac-hj-np-z02-9]{59})|1[ac-hj-np-z02-9]{8,87})|([13]|[mn2])[a-km-zA-HJ-NP-Z1-9]{25,39})\b/,
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
};
