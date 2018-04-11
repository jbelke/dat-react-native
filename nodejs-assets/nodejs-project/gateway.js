const DatGateway = require('dat-gateway');

/**
 * @function default
 * @param  {Number} port    Port to start the gateway
 * @param  {String} appPath Path to use as a directory to Dats
 * @return {Promise} Resolves when the server is started
 */
module.exports = (port, appPath) =>
  new Promise((resolve, reject) => {
    const gateway = new DatGateway({
      dir: appPath,
      max: 20,
      maxAge: 10 * 60 * 1000 // Ten minutes
    });

    gateway
      .listen(port)
      .then(() => {
        return resolve();
      })
      .catch(err => {
        return reject(err);
      });
  });