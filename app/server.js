// const findAvailablePort = require('./src/modules/portAssign');

const server = {
  // eslint-disable-next-line max-statements
  init: () => {
    const express = require('express');
    const Path = require('path');
    const bodyParser = require('body-parser');

    const app = express();
    const port = process.env.PORT || 8081;

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
