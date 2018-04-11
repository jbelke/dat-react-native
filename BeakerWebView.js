import React, { Component } from 'react';
import { WebView } from 'react-native';

const BASE_URI = 'http://localhost';

class BeakerWebView extends Component {
  constructor (props) {
    super(props);

    this.getResourcesBaseScript = this.getResourcesBaseScript.bind(this);
  }

  state = {
    navigatingUri: ''
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    let { uri, port } = nextProps;

    // Verify protocol
    const datExpression = new RegExp(/^dat:\/\/?/i);

    if (datExpression.test(uri)) {
      uri = uri.replace(datExpression, '');
    }

    const finalUri = `${BASE_URI}:${port}/${uri}`;

    return this.setState({
      navigatingUri: finalUri
    });
  }

  getResourcesBaseScript () {
    const { port } = this.props;
    const { navigatingUri } = this.state;

    return `(function () {
      var assets = Array.from(document.querySelectorAll('[href]')).concat(Array.from(document.querySelectorAll('[src]')));

      for (var index = 0; index < assets.length; index++) {
        var element = assets[index];
        var attr = element.href ? 'href' : 'src';
        var elementSrc = element[attr].replace('${BASE_URI}:${port}', '${navigatingUri}');

        element[attr] = elementSrc;
      }
    }());`;
  }

  render () {
    const { navigatingUri } = this.state;
    const injectedJavaScript = this.getResourcesBaseScript();

    return (
      <WebView source={{ uri: navigatingUri }}
        automaticallyAdjustContentInsets={ true }
        injectedJavaScript={ injectedJavaScript } />
    );
  }
}

export default BeakerWebView;