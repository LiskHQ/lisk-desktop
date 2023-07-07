const PERMISSION_WHITE_LIST = ['clipboard-read', 'notifications', 'openExternal'];
export const WHITE_LISTED_DOMAIN = ['localhost', 'lisk.com'];

export const setRendererPermissions = (win) => {
  win.browser.webContents.session.setPermissionRequestHandler((_, permission, callback) => {
    callback(PERMISSION_WHITE_LIST.includes(permission));
  });
};
