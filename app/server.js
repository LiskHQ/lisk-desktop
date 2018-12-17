// eslint-disable-next-line max-statements
const server = function () {
  const express = require('express');
  const Path = require('path');
  const bodyParser = require('body-parser');

  const app = express();
  const port = process.env.PORT || 8080;

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

  app.listen(port, () => { console.log(`App listen on port ${port}`); });
};

export default server;
