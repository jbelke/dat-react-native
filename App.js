import React, { Component } from 'react';
import {
  Button,
  Text,
  TextInput,
  View,
  WebView
} from 'react-native';
import nodejs from 'nodejs-mobile-react-native';
import RNFS from 'react-native-fs';

const BASE_URI = 'http://localhost';

export default class App extends Component {
  constructor (props) {
    super(props);

    this.receiveMessage = this.receiveMessage.bind(this);
    this.request = this.request.bind(this);
  }

  state = {
    port: null,
    inputValue: ''
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
    const { port, inputValue } = this.state;

    if (!port) {
      return alert('Server error.');
    }

    // Uri from the UI
    const uri = `${BASE_URI}:${port}/${inputValue}`;

    // Update state to load the Dat
    return this.setState({ uri });
  }

  render() {
    const { inputValue } = this.state;

    return (
      <View style={{
        paddingTop: 40,
        paddingLeft: 20,
        paddingRight: 20,
        flex: 1,
        justifyContent: 'center'
      }}>
        <TextInput
          defaultValue={ inputValue }
          onChangeText={ value => this.setState({ inputValue: value }) }
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1
          }} />
        <Button title="Download"
          onPress={ () => this.request() } />

        <WebView style={{
          flex: 1,
          height: 300
        }} source={{ uri: this.state.uri }} />
      </View>
    );
  }
}