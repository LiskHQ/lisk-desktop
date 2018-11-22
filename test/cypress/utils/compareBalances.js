const castBalanceStringToNumber = number => parseFloat(number.replace(/,/g, ''));

export default function compareBalances(balanceBeforeString, balanceAfterString, cost) {
  const balanceBefore = castBalanceStringToNumber(balanceBeforeString);
  const balanceAfter = castBalanceStringToNumber(balanceAfterString);
  expect(balanceAfter).to.be.equal(parseFloat((balanceBefore - cost).toFixed(6)));
}
