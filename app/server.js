const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: 'You can only make 5 requests per minute',
});

const server = {
  init: (host, port) => {
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
    app.use(limiter);
    app.listen(port, host);

    return `http://${host}:${port}/`;
  },
};

export default server;
