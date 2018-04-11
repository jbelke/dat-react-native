#!/bin/bash
      # Helper script for Gradle to call node on macOS in case it is not found
      export PATH=$PATH:/Users/romuloalves/Projects/beakerReactNative/node_modules/nodejs-mobile-react-native/node_modules/.bin:/Users/romuloalves/.config/yarn/link/node_modules/.bin:/Users/romuloalves/Projects/beakerReactNative/node_modules/nodejs-mobile-react-native/node_modules/.bin:/Users/romuloalves/.config/yarn/link/node_modules/.bin:/usr/local/Cellar/node/9.10.1/libexec/lib/node_modules/npm/bin/node-gyp-bin:/usr/local/Cellar/node/9.10.1/lib/node_modules/npm/bin/node-gyp-bin:/usr/local/Cellar/node/9.10.1/bin/node_modules/npm/bin/node-gyp-bin:/usr/local/bin:/Users/romuloalves/.nvm/versions/node/v9.9.0/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/opt/bin
      node $@
    