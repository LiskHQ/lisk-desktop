const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');

const API_RATE_LIMITER = process.env.API_RATE_LIMITER || 50;

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: API_RATE_LIMITER,
  message: `You can only make ${API_RATE_LIMITER} requests per minute`,
});

const server = {
  init: (host, port) => {
    if (process.env.LISK_DESKTOP_URL) {
      return process.env.LISK_DESKTOP_URL;
    }

    const app = express();

    app.set('views', path.join(__dirname, '.'));
    app.use(limiter);
    app.use(express.static(path.join(__dirname, '.')));

    app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../setup/react/index.html')));

    // catch 404 and forward to error handler
    app.use((req, res, next) => {
      const err = new Error('Not Found');
      err.status = 404;
      next(err);
    });
    app.listen(port, host);

    return `http://${host}:${port}/`;
  },
};

export default server;
