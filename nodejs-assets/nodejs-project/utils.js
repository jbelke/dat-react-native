const freeport = require('freeport');

/**
 * @function findFreePort
 * @description Returns a free port to start a server
 * @return {Promise<Number>} A free port
 */
module.exports.findFreePort = () =>
  new Promise((resolve, reject) => {
    return freeport((err, port) => {
      if (err) {
        return reject(err);
      }

      return resolve(port);
    });
  });