import io from 'socket.io-client';

export const subscribeConnections = {};

const ws = ({ baseUrl, requests }) =>
  new Promise((resolve, reject) => {
    const uri = `${baseUrl.replace('http', 'ws')}/rpc-v3`;
    const socket = io(uri, {
      transports: ['websocket'],
    });

    socket.emit('request', requests, (response) => {
      if (response.error) reject(response.error);
      else {
        if (!Array.isArray(response)) resolve(response.result);
        const normRes = response.reduce(
          (acc, res) => {
            res.result.data.forEach((item) => acc.data.push(item));
            acc.meta.count += res.result.meta.count;
            acc.meta.offset = res.result.meta.offset;
            return acc;
          },
          {
            data: [],
            meta: {
              count: 0,
              offset: 0,
            },
          }
        );

        resolve(normRes);
      }
    });
  });

/**
 * Connect to an event and set function to be called when it fires
 */
export const subscribe = (node, eventName, callback, onDisconnect, onReconnect) => {
  const connection = io(node, {
    forceNew: true,
    transports: ['websocket'],
  });
  connection.on(eventName, callback);
  connection.on('reconnect', onReconnect);
  connection.on('disconnect', () => {
    if (subscribeConnections[eventName] && !subscribeConnections[eventName].forcedClosing) {
      onDisconnect();
    }
  });
  subscribeConnections[eventName] = { connection, forcedClosing: false };
};

/**
 * Close event connection
 */
export const unsubscribe = (eventName) => {
  const eventConnection = subscribeConnections[eventName];
  if (eventConnection) {
    eventConnection.forcedClosing = true;
    eventConnection.connection.close();
    eventConnection.forcedClosing = false;
    delete subscribeConnections[eventName];
  }
};

export default ws;
