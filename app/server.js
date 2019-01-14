const server = {
  // eslint-disable-next-line max-statements
  init: (port) => {
    const express = require('express'); // eslint-disable-line
    const Path = require('path');
    const bodyParser = require('body-parser'); // eslint-disable-line

    if (process.env.LISK_HUB_PORT) {
      return `http://localhost:${port}/`;
    }

    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.set('views', Path.join(__dirname, '.'));
    app.use(express.static(Path.join(__dirname, '.')));

    app.get('*', (req, res) => res.sendFile(Path.join(__dirname, 'index.html')));

    // catch 404 and forward to error handler
    app.use((req, res, next) => {
      const err = new Error('Not Found');
      err.status = 404;
      next(err);
    });
    app.listen(port);
    return `http://localhost:${port}/`;
  },
};

export default server;
