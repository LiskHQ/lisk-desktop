
/**
 * This filter
 *
 * @module app
 * @submodule notEnoughBalance
 */
app.filter('notEnoughBalance', (Account, lsk) => amount => lsk.normalize(Account.get().balance) < amount);
