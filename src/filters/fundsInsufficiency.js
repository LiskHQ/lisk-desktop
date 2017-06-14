
/**
 * This filter returns bool value which is true if account balance is less then input value
 *
 * @module app
 * @submodule fundsInsufficiency
 */
app.filter('fundsInsufficiency', (Account, lsk) => amount => lsk.normalize(Account.get().balance) < amount);
