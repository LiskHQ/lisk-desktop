const castBalanceStringToNumber = number => parseFloat(number.replace(/,/g, ''));

export default function compareBalances(balanceBeforeString, balanceAfterString, cost) {
  const balanceBefore = castBalanceStringToNumber(balanceBeforeString.replace(' LSK', ''));
  const balanceAfter = castBalanceStringToNumber(balanceAfterString.replace(' LSK', ''));
  expect(balanceAfter).to.be.equal(parseFloat((balanceBefore - cost).toFixed(6)));
}
