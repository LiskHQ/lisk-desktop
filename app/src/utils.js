const PERMISSION_WHITE_LIST = ['clipboard-read', 'notifications', 'openExternal'];
export const WHITE_LISTED_DOMAIN = ['localhost', 'lisk.com'];

export const setRendererPermissions = (win) => {
  win.browser.webContents.session.setPermissionRequestHandler(
    (webContents, permission, callback) => {
      const parsedUrl = new URL(webContents.getURL());

      if (parsedUrl.protocol !== 'https:') return callback(false);

      return callback(PERMISSION_WHITE_LIST.includes(permission));
    }
  );
};
