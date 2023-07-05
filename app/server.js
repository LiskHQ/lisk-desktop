const express = require('express');
const path = require('path');

const server = {
  init: (port) => {
    if (process.env.LISK_DESKTOP_URL) {
      return process.env.LISK_DESKTOP_URL;
    }

    const app = express();

    app.set('views', path.join(__dirname, '.'));
    app.use(express.static(path.join(__dirname, '.')));

    app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../setup/react/index.html')));

    // catch 404 and forward to error handler
    app.use((req, res, next) => {
      const err = new Error('Not Found');
      err.status = 404;
      next(err);
    });
    app.listen(port, '127.0.0.1');
    return `http://localhost:${port}/`;
  },
};

export default server;
