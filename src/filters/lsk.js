/**
 * This filter uses lsk factory to normalize the raw value in LSK
 *
 * @module app
 * @submodule lsk
 */
app.filter('lsk', lsk => lsk.normalize);
