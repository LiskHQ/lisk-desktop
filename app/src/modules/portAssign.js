const fp = require('find-free-port');

const getPort = fp(3000)
  .then(([freep]) => freep)
  .catch((err) => {
    throw err;
  });

async function findAvailablePort() {
  const port = await getPort();
  return port;
}

module.exports = findAvailablePort;
