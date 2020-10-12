export default {
  address: /^[1-9]\d{0,19}L$/,
  publicKey: /^[0-9a-f]{64}$/,
  delegateName: /^[a-z0-9!@$&_.]{0,20}$/,
  transactionId: /^[1-9]\d{0,19}$/,
  blockId: /^[1-9]\d{0,19}$/,
  btcAddressTrunk: /^(.{10})(.+)?(.{10})$/,
  lskAddressTrunk: /^(.{6})(.+)?(.{5})$/,
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
