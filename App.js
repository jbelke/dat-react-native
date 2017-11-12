/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {
  Button,
  Text,
  TextInput,
  View
} from 'react-native'

import nodejs from 'nodejs-mobile-react-native'

import RNFS from 'react-native-fs'

const BASE_URI = 'http://localhost:8182'

export default class App extends Component<{}> {
  constructor (props) {
    super(props)

    this.state = {
      key: '',
      files: []
    }

    this.getDatFiles = this.getDatFiles.bind(this)
    this.setPath = this.setPath.bind(this)
  }

  componentWillMount () {
    nodejs.start();
    nodejs.channel.addListener(
      'message',
      () => {
        this.setPath()
      },
      this
    );
  }

  async setPath () {
    try {
      await fetch(`${BASE_URI}/setPath`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          path: RNFS.DocumentDirectoryPath
        })
      })
    } catch (err) {
      alert(JSON.stringify(err))
    }
  }

  async getDatFiles () {
    const { key } = this.state

    try {
      const response = await fetch(`${BASE_URI}/download/${key}`, { method: 'POST' })
      alert('Dat downloaded!')

      const filesJson = await response.json()

      this.setState({
        files: filesJson
      })
    } catch (err) {
      alert(JSON.stringify(err))
    }
  }

  render() {
    const files = this.state.files.map(item => {
      return <Text key={ item }>{ item }</Text>
    })

    return (
      <View style={{
        paddingTop: 40,
        paddingLeft: 20,
        paddingRight: 20,
        flex: 1,
        justifyContent: 'center'
      }}>
        <TextInput
          onChangeText={ text => this.setState({ key: text }) }
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1
          }} />
        <Button title="Download"
          onPress={ () => this.getDatFiles() } />

        <View style={{
          flex: 1,
          height: 300
        }}>
          { files }
        </View>
      </View>
    );
  }
}