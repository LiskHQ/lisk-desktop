const castBalanceStringToNumber = (number) => parseFloat(number.replace(/,/g, ''));

export default function compareBalances(balanceBeforeString, balanceAfterString, cost) {
  const balanceBefore = castBalanceStringToNumber(balanceBeforeString.replace(' LSK', ''));
  const balanceAfter = castBalanceStringToNumber(balanceAfterString.replace(' LSK', ''));
  // expect(balanceAfter - parseFloat(balanceBefore - cost)).to.lt(0.1);
  expect(parseFloat(balanceBefore - cost) - balanceAfter).to.lte(0.1);
}
