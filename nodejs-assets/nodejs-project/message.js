/**
 * @function error
 * @description Creates an stringified JSON error message
 * @param  {Object}  Error to return
 * @return {String} Error message as JSON
 */
module.exports.error = err => JSON.stringify({
  type: 'error',
  data: err
});

/**
 * @function ok
 * @description Creates an stringified JSON to OK message
 * @return {String} OK message as JSON
 */
module.exports.ok = () => JSON.stringify({
  type: 'ok'
});

/**
 * @function port
 * @description Creates an stringified JSON to send the server port
 * @param  {Number} port Port of the server
 * @return {String} Message as JSON
 */
module.exports.port = port => JSON.stringify({
  type: 'port',
  data: port
});