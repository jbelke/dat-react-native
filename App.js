import React, { Component } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  WebView
} from 'react-native';
import nodejs from 'nodejs-mobile-react-native';
import RNFS from 'react-native-fs';

const BASE_URI = 'http://localhost';
const DEFAULT_URI = 'about:blank';

export default class App extends Component {
  constructor (props) {
    super(props);

    this.receiveMessage = this.receiveMessage.bind(this);
    this.request = this.request.bind(this);
    this.onUriInputChange = this.onUriInputChange.bind(this);
    this.onUriInputFocus = this.onUriInputFocus.bind(this);
  }

  state = {
    port: null,
    inputValue: DEFAULT_URI
  }

  componentWillMount () {

    // Start node server
    nodejs.start('main.js');

    // When receive the message from the node, set App path
    nodejs.channel.addListener('message', this.receiveMessage, this);
  }

  /**
   * @function receiveMessage
   * @description Receives a message and executes the respective action
   * @param  {String} msg JSON stringed message
   */
  receiveMessage (msg) {
    const { type, data } = JSON.parse(msg);

    switch (type) {
      case 'ok': // Send path to the server

        const message = JSON.stringify({
          type: 'path',
          data: RNFS.DocumentDirectoryPath
        });

        nodejs.channel.send(message);
        break;

      case 'port': // Received server port to execute requests
        return this.setState({
          port: data
        });

      case 'error':
        alert(`ERROR: ${JSON.stringify(data)}`);
        break;
    }
  }

  /**
   * @function request
   * @description Executes request to the server to load the Dat
   */
  request () {

    // Server port
    let { port, inputValue } = this.state;

    if (!port) {
      return alert('Server error.');
    }

    let uri = null;

    // Verify protocol
    const httpExpression = new RegExp(/http(s)?/);
    const datExpression = new RegExp(/^dat:\/\/?/i);

    if (httpExpression.test(inputValue)) {
      uri = inputValue;
    } else {

      // Try dat
      if (datExpression.test(inputValue)) {
        inputValue = inputValue.replace(datExpression, '');
      }

      uri = `${BASE_URI}:${port}/${inputValue}`;
    }


    // Update state to load the Dat
    return this.setState({ uri });
  }

  /**
   * @function onUriInputChange
   * @description Called when the URI input changes its value to update the state
   * @param  {String} inputValue Input value
   */
  onUriInputChange (inputValue) {
    return this.setState({
      inputValue
    });
  }

  /**
   * @function onUriInputFocus
   * @description Called when a focus happens in the URI input
   */
  onUriInputFocus () {
    const { inputValue } = this.state;

    if (inputValue !== DEFAULT_URI) {
      return;
    }

    return this.setState({
      inputValue: ''
    });
  }

  render() {
    const { inputValue, uri } = this.state;

    return (
      <View style={ styles.container }>
        <View style={ styles.header }>
          <TextInput
            defaultValue={ inputValue }
            onChangeText={ this.onUriInputChange }
            onFocus={ this.onUriInputFocus }
            onSubmitEditing={ this.request }
            autoCorrect={ false }
            blurOnSubmit={ true }
            selectTextOnFocus={ true }
            returnKeyType="go"
            initialScale={ 100 }
            clearButtonMode="while-editing"
            underlineColorAndroid="transparent"
            style={ styles.uriInput } />
        </View>

        <WebView style={ styles.webview } source={{ uri }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    backgroundColor: '#e9e9e9',
    height: 64,
    padding: 15
  },
  uriInput: {
    backgroundColor: '#fff',
    height: 40
  },
  webview: {
    flex: 1
  }
});