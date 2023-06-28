export const calculateSupply = (balance, totalSupply) =>
  Number((balance * 100) / totalSupply).toFixed(2);
