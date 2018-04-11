const rnBridge = require('rn-bridge');
const { join } = require('path');

const { findFreePort } = require('./utils');
const gateway = require('./gateway');
const message = require('./message');

// Echo every message received from react-native
rnBridge.channel.on('message', async msg => {
  const { type, data } = JSON.parse(msg);

  try {

    // Received app path, start Dat gateway
    if (type === 'path') {

      // Get a free port
      const port = await findFreePort();

      // Start the Dat gateway
      await gateway(port, data);

      console.log(`[dat-gateway] Now listening on port ${port} with path ${data}`);

      // Send message with the server port
      return rnBridge.channel.send(message.port(port));
    }
  } catch (err) {

    console.error(err);

     // Send an error message
    return rnBridge.channel.send(message.error(err));
  }

});

// Inform react-native node is initialized
rnBridge.channel.send(message.ok());